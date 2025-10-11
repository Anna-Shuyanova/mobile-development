import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Новый компонент статистики
const TaskStatistics = ({
  tasks,
  filter,
  onFilterChange,
  onClearCompleted,
  saveStatus
}) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const active = total - completed;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <View style={styles.statsContainer}>
      {/* Статус сохранения */}
      <View style={styles.saveStatusContainer}>
        <Text style={[
          styles.saveStatusText,
          saveStatus === 'Сохранено' ? styles.saveStatusSuccess : styles.saveStatusSaving
        ]}>
          {saveStatus === 'Сохранено' ? '💾 ' : '⏳ '}{saveStatus}
        </Text>
      </View>

      {/* Основная статистика */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{total}</Text>
          <Text style={styles.statLabel}>Всего</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.statActive]}>{active}</Text>
          <Text style={styles.statLabel}>Активные</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.statCompleted]}>{completed}</Text>
          <Text style={styles.statLabel}>Выполнены</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.statPercentage]}>{completionPercentage}%</Text>
          <Text style={styles.statLabel}>Прогресс</Text>
        </View>
      </View>

      {/* Прогресс бар */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${completionPercentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{completionPercentage}% выполнено</Text>
      </View>

      {/* Кнопки фильтрации */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Фильтры:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => onFilterChange('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              🌟 Все
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
            onPress={() => onFilterChange('active')}
          >
            <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
              🔵 Активные
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
            onPress={() => onFilterChange('completed')}
          >
            <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
              ✅ Выполненные
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Кнопка очистки выполненных */}
      {completed > 0 && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={onClearCompleted}
        >
          <Text style={styles.clearText}>🗑️ Очистить выполненные ({completed})</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('Загрузка...');

  // Функция загрузки задач из AsyncStorage
  const loadTasksFromStorage = async () => {
    try {
      setIsLoading(true);
      setSaveStatus('Загрузка...');
      const savedTasks = await AsyncStorage.getItem('@tasks');
      if (savedTasks !== null) {
        setTasks(JSON.parse(savedTasks));
      }
      setSaveStatus('Сохранено');
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setSaveStatus('Ошибка загрузки');
      Alert.alert('Ошибка', 'Не удалось загрузить задачи');
    } finally {
      setIsLoading(false);
    }
  };

  // Функция сохранения задач в AsyncStorage
  const saveTasksToStorage = async (tasksToSave) => {
    try {
      setSaveStatus('Сохранение...');
      await AsyncStorage.setItem('@tasks', JSON.stringify(tasksToSave));
      setSaveStatus('Сохранено');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      setSaveStatus('Ошибка сохранения');
      Alert.alert('Ошибка', 'Не удалось сохранить задачи');
    }
  };

  // Эффект для загрузки задач при старте приложения
  useEffect(() => {
    loadTasksFromStorage();
  }, []);

  // Эффект для сохранения задач при их изменении
  useEffect(() => {
    if (!isLoading) {
      saveTasksToStorage(tasks);
    }
  }, [tasks, isLoading]);

  const addTask = () => {
    if (inputText.trim()) {
      const newTask = {
        id: Date.now().toString(),
        text: inputText.trim(),
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setInputText('');
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearCompletedTasks = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  // Иконки в виде emoji
  const TaskIcon = "📝";
  const CompletedIcon = "✅";
  const DeleteIcon = "❌";
  const AddIcon = "➕";

  // Показываем индикатор загрузки при первоначальной загрузке
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Загрузка задач...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Верхняя панель с заголовком */}
      <View style={styles.header}>
        <Text style={styles.title}>🚀 Менеджер задач</Text>
      </View>

      {/* Компонент статистики */}
      <TaskStatistics
        tasks={tasks}
        filter={filter}
        onFilterChange={setFilter}
        onClearCompleted={clearCompletedTasks}
        saveStatus={saveStatus}
      />

      {/* Поле ввода и кнопка добавления */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="✏️ Введите новую задачу..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.buttonText}>{AddIcon}</Text>
        </TouchableOpacity>
      </View>

      {/* Список задач */}
      {filteredTasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyText}>
            {filter === 'completed' ? 'Нет выполненных задач' : 
             filter === 'active' ? 'Нет активных задач' : 'Пока нет задач'}
          </Text>
          <Text style={styles.emptySubtext}>
            {filter === 'all' ? 'Добавьте первую задачу выше!' : 'Измените фильтр для просмотра других задач'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[
              styles.taskItem,
              item.completed && styles.taskItemCompleted
            ]}>
              <TouchableOpacity 
                style={[styles.checkbox, item.completed && styles.checkboxCompleted]}
                onPress={() => toggleTask(item.id)}
              >
                <Text style={styles.checkboxText}>
                  {item.completed ? CompletedIcon : TaskIcon}
                </Text>
              </TouchableOpacity>
              <Text style={[styles.taskText, item.completed && styles.taskCompleted]}>
                {item.text}
              </Text>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteTask(item.id)}
              >
                <Text style={styles.deleteText}>{DeleteIcon}</Text>
              </TouchableOpacity>
            </View>
          )}
          style={styles.taskList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#7f8c8d',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
  },
  // Стили для компонента статистики
  statsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  saveStatusContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  saveStatusText: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  saveStatusSuccess: {
    backgroundColor: '#d5f4e6',
    color: '#27ae60',
  },
  saveStatusSaving: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statActive: {
    color: '#3498db',
  },
  statCompleted: {
    color: '#27ae60',
  },
  statPercentage: {
    color: '#9b59b6',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3498db',
    backgroundColor: '#fff',
  },
  filterButtonActive: {
    backgroundColor: '#3498db',
  },
  filterText: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: 12,
  },
  filterTextActive: {
    color: '#fff',
  },
  clearButton: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  clearText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#2c3e50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#27ae60',
    width: 55,
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  taskList: {
    flex: 1,
    marginBottom: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  taskItemCompleted: {
    borderLeftColor: '#27ae60',
    backgroundColor: '#f8fff9',
  },
  checkbox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  checkboxCompleted: {
    backgroundColor: '#27ae60',
  },
  checkboxText: {
    fontSize: 16,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#ffeaea',
  },
  deleteText: {
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 50,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
});

export default App;
