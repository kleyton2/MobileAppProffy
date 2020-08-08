import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './style';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';





function TeacherList() {
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(res => {
            if (res) {
                const favoritedTeachers = JSON.parse(res);
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id;
                })
                setFavorites(favoritedTeachersIds);
            }
        });
    }

    useFocusEffect(() => {
        loadFavorites();
    });


    function handelToggleFiltersVisible() {
        setIsFiltersVisible(!isFiltersVisible);
    }

    async function handelFilterSubmit() {
        loadFavorites();
        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time,
            }
        });

        setIsFiltersVisible(false);
        setTeachers(response.data);
    }

    return (
    <View style={styles.container}>
        <PageHeader 
            title="Proffys disponiveis" 
            headerRight={(
                <BorderlessButton onPress={handelToggleFiltersVisible}>
                    <Feather name="filter" size={20} color="#fff" />
                </BorderlessButton>
            )}
            > 

            {isFiltersVisible && (
                <View style={styles.searchForm}>
                    <Text style={styles.label}>Matéria</Text>
                    <TextInput
                        style={styles.input}
                        value={subject}
                        onChangeText={text => setSubject(text)}
                        placeholder="Qual a materia?"
                        placeholderTextColor="#c1bccc"
                    />
                
                    <View style={styles.inputGroup}>
                    <View style={styles.inputBlock}>
                    <Text style={styles.label}>Dia da semana</Text>
                    <TextInput
                        style={styles.input}
                        value={week_day}
                        onChangeText={text => setWeekDay(text)}
                        placeholder="Qual o dia?"
                        placeholderTextColor="#c1bccc"
                    />
                    </View>

                    <View style={styles.inputBlock}>
                    <Text style={styles.label}>Horário</Text>
                    <TextInput
                        style={styles.input}
                        value={time}
                        onChangeText={text => setTime(text)}
                        placeholder="Qual horário?"
                        placeholderTextColor="#c1bccc"
                    />
                    </View>
                    </View>
                    <RectButton onPress={handelFilterSubmit} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Filtrar</Text>
                    </RectButton>
                </View>
            )}
        </PageHeader>

        <ScrollView
            style={styles.teacherList}
            contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 16,
            }}
        >
            {teachers.map((teacher: Teacher) => {
                return (
                    <TeacherItem 
                        key={teacher.id} 
                        teacher={teacher}
                        favorited={favorites.includes(teacher.id)} 
                    />
                )
            })}          
        </ScrollView>
    </View>
    );
}

export default TeacherList;