import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Modal, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Audio } from 'expo-av';

export default function App() {
    const [tempoAtual, setTempoAtual] = useState(new Date());
    const [modalAlarme, setModalAlarme] = useState(false);
    const [picker, setPicker] = useState(false);
    const [horaSelecionada, setHoraSelecionada] = useState('00');
    const [minutosSelecionados, setMinutosSelecionados] = useState('00');
    const [arrayDespertadores, setArrayDespertadores] = useState([]);
    const [tituloAlarme, setTituloAlarme] = useState('');
    const [selectedMusica, setSelectedMusica] = useState(null);
    const [despertadorTocando, setDespertadorTocando] = useState(false);
    const [alarmeAtual, setAlarmeAtual] = useState(null); // Alarme que está tocando atualmente

    const carregarMusica = async (musicaPath) => {
        try {
            const { sound } = await Audio.Sound.createAsync(musicaPath);
            return sound;
        } catch (error) {
            console.error('Erro ao carregar música:', error);
            return null;
        }
    };

    useEffect(() => {
        let timer;
        if (!modalAlarme) {
            timer = setInterval(() => setTempoAtual(new Date()), 1000);
        }
        return () => clearInterval(timer);
    }, [modalAlarme]);


    useEffect(() => {
        const timer = setInterval(() => {
            const horaAtual = tempoAtual.getHours();
            const minutoAtual = tempoAtual.getMinutes();
            const segundoAtual = tempoAtual.getSeconds();

            arrayDespertadores.forEach((alarme, index) => {
                if (
                    alarme.hora === horaAtual.toString() &&
                    alarme.minuto === minutoAtual.toString().padStart(2, '0') &&
                    segundoAtual == 0 &&
                    !despertadorTocando
                ) {
                    tocarOuPararMusica(index, true);
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [tempoAtual, arrayDespertadores, despertadorTocando]);

    const guardarHoras = (event, horasSelecionada) => {
        const hora = horasSelecionada.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const [h, m] = hora.split(':');
        setHoraSelecionada(h);
        setMinutosSelecionados(m);
        setPicker(false);
    };

    const salvarAlarme = async () => {
        if (tituloAlarme.trim() === '') {
            alert('Por favor, preencha o título do despertador.');
            return;
        }

        let musicaCarregada = null;
        if (selectedMusica && selectedMusica !== "Sem_Música") {
            musicaCarregada = await carregarMusica(selectedMusica);
        }

        const novoAlarme = {
            titulo: tituloAlarme,
            hora: horaSelecionada,
            minuto: minutosSelecionados,
            musica: musicaCarregada
        };
        const novaLista = [...arrayDespertadores, novoAlarme];
        setArrayDespertadores(novaLista);
        setModalAlarme(false);
        setTituloAlarme('');

        try {
            await AsyncStorage.setItem('arrayDespertadores', JSON.stringify(novaLista));
        } catch (error) {
            console.error('Erro ao salvar alarme:', error);
        }
    };

    const apagarAlarme = async (index) => {
        const novaLista = arrayDespertadores.filter((_, i) => i !== index);
        setArrayDespertadores(novaLista);

        try {
            await AsyncStorage.setItem('arrayDespertadores', JSON.stringify(novaLista));
        } catch (error) {
            console.error('Erro ao apagar alarme:', error);
        }
    };

    const tocarOuPararMusica = async (index) => {
        const alarme = arrayDespertadores[index];

        if (despertadorTocando && alarmeAtual?.index === index) {
            // Parar a música
            if (alarme.musica) await alarme.musica.stopAsync();
            setDespertadorTocando(false);
            setAlarmeAtual(null);
        } else if (alarme.musica) {
            // Tocar a música
            await alarme.musica.playAsync();
            setDespertadorTocando(true);
            setAlarmeAtual({ ...alarme, index });
        }
    };


    const abrirModal = () => {
        setModalAlarme(true);
        setHoraSelecionada(tempoAtual.getHours().toString().padStart(2, '0'));
        setMinutosSelecionados(tempoAtual.getMinutes().toString().padStart(2, '0'));
    };

    const tempoAmPM = () => {
        return tempoAtual < 12 ? 'AM' : 'PM';
    };


    return (
        <View style={style.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6200ad" />
            <View style={style.titulo}>
                <Text style={{ textAlign: 'center', color: 'white', fontSize: 30, fontWeight: 'bold', marginBottom: 20 }}>Alarme</Text>
            </View>
            {/* Modal para alarme automático */}
            {despertadorTocando && (
                <Modal visible={despertadorTocando} transparent={true} animationType="fade">
                    <View style={style.modalAlarmeContainer}>
                        <Text style={{ fontSize: 30, color: 'white', textAlign: 'center', backgroundColor: '#6200ad', paddingVertical: 20, borderTopWidth: 5, borderColor: '#9f2ff5' }}>{alarmeAtual.titulo}</Text>
                        <Text style={{ fontSize: 60, color: 'white', textAlign: 'center', marginVertical: 30 }}>
                            {alarmeAtual.hora}:{alarmeAtual.minuto}
                        </Text>
                        <Button color={'green'} title="Parar Música" onPress={() => tocarOuPararMusica(alarmeAtual.index)} />
                    </View>
                </Modal>
            )}

            {modalAlarme && (
                <Modal
                    visible={modalAlarme}
                    transparent={true}
                    onRequestClose={() => setModalAlarme(false)}
                    animationType="fade"
                >
                    <View style={style.modalAlarmeContainer}>
                        <View style={style.titulo}>
                            <Text style={{ textAlign: 'center', color: 'white', fontSize: 20, fontWeight: 'bold' }}>Horário definido:</Text>
                        </View>
                        <TextInput
                            style={style.inputTitulo}
                            placeholder="Título do despertador"
                            placeholderTextColor="#aaa"
                            value={tituloAlarme}
                            onChangeText={setTituloAlarme}
                            maxLength={30}
                            multiline
                        />
                        {picker && (
                            <DateTimePicker
                                mode="time"
                                value={tempoAtual}
                                onChange={guardarHoras}
                                minuteInterval={1}
                            />
                        )}
                        <View style={style.horasContainer}>
                            <Text style={{ fontSize: 55, color: 'white' }}>{horaSelecionada}</Text>
                            <Text style={{ fontSize: 55, color: 'white' }}>:</Text>
                            <Text style={{ fontSize: 55, color: 'white' }}>{minutosSelecionados}</Text>
                        </View>
                        <Picker
                            style={{ color: 'white' }}
                            selectedValue={selectedMusica}
                            onValueChange={(itemValue) => setSelectedMusica(itemValue)}>
                            <Picker.Item label="Sem Música" value="Sem_Música" />
                            <Picker.Item label="Alarme 1" value={require('../resources/alarme01.mp3')} />
                            <Picker.Item label="Alarme 2" value={require('../resources/alarme02.mp3')} />
                            <Picker.Item label="Alarme 3" value={require('../resources/alarme03.mp3')} />
                            <Picker.Item label="Alarme 4" value={require('../resources/alarme04.mp3')} />
                            <Picker.Item label="Alarme 5" value={require('../resources/alarme05.mp3')} />
                        </Picker>
                        <TouchableOpacity onPress={() => setPicker(true)} style={style.botaoHorario1}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Escolher horário</Text>
                        </TouchableOpacity>
                        <View style={style.botaoHorarioContainer}>
                            <TouchableOpacity onPress={() => setModalAlarme(false)} style={style.botaoHorario2}>
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={salvarAlarme} style={style.botaoHorario3}>
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
            <Text style={{ textAlign: 'center', paddingTop: 20 }}>Hora Atual:</Text>
            <View style={style.horasContainer}>
                <Text style={style.horasTempo}>{tempoAtual.getHours()}</Text>
                <Text style={style.horasTempo}>:</Text>
                <Text style={style.horasTempo}>{tempoAtual.getMinutes().toString().padStart(2, '0')}</Text>
                <Text style={style.horasTempo}>:</Text>
                <Text style={style.horasTempo}>{tempoAtual.getSeconds()}</Text>
                <Text style={{ fontWeight: 'bold' }}>{tempoAmPM()}</Text>
            </View>
            <ScrollView style={style.listAlarmes}>
                <View style={style.titulo}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center', paddingBottom: 15 }}>Despertadores:</Text>
                </View>
                {arrayDespertadores.map((alarme, index) => (
                    <View style={style.listAlarmes2} key={index}>
                        <View style={style.boxList}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{alarme.titulo}:</Text>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                {alarme.hora}:{alarme.minuto} - {alarme.musica ? 'Com música' : 'Sem música'}
                            </Text>
                        </View>
                        <View style={style.boxList2}>
                            <TouchableOpacity style={style.botaoApagar} onPress={() => apagarAlarme(index)}>
                                <Text style={{ color: 'white', textAlign: 'center' }}>X</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={style.botaoOuvir}
                                onPress={() => tocarOuPararMusica(index)}>
                                <Text style={{ color: 'white', textAlign: 'center' }}>Ouvir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

            </ScrollView>
            <View style={style.botaoAlarme}>
                <TouchableOpacity style={style.botao} onPress={() => abrirModal()}>
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}



const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    titulo: {
        backgroundColor: '#6200ad',
    },
    horasContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    horasTempo: {
        fontSize: 50,
        textAlignVertical: 'center',
    },
    listAlarmes: {
        flex: 1,
        backgroundColor: '#9f2ff5',
        borderColor: '#6200ad',
        borderTopWidth: 10,
    },
    listAlarmes2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderColor: '#6200ad',
        paddingVertical: 20,
    },
    botaoApagar: {
        marginHorizontal: 10,
        backgroundColor: '#b30000',
        width: 40,
        height: 40,
        paddingVertical: 10,
        borderRadius: 20
    },
    botaoOuvir: {
        marginHorizontal: 10,
        backgroundColor: 'green',
        width: 40,
        height: 40,
        paddingVertical: 10,
        borderRadius: 20
    },
    botaoAlarme: {
        position: 'absolute',
        bottom: 20,
        right: 10,
    },
    botao: {
        paddingHorizontal: 18,
        backgroundColor: '#6200ad',
        padding: 10,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'white',
    },
    modalAlarmeContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
        backgroundColor: '#9d00e1',
        width: '80%',
        paddingBottom: 20,
        paddingHorizontal: 0,
        borderWidth: 2,
        borderColor: '#6200ad',
    },
    botaoHorarioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    botaoHorario1: {
        backgroundColor: '#6200ad',
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginBottom: 10,
        borderRadius: 10,
    },
    botaoHorario2: {
        backgroundColor: '#b30000',
        padding: 20,
        borderRadius: 20,
    },
    botaoHorario3: {
        backgroundColor: 'green',
        padding: 20,
        borderRadius: 20,
    },
    inputTitulo: {
        backgroundColor: '#fff',
        color: '#000',
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 10,
        borderRadius: 5,
    },
    boxList: {
        width: '40%',
        marginHorizontal: 20,
        justifyContent: 'center',
    },
    boxList2: {
        width: '50%',
        marginHorizontal: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    }
});
