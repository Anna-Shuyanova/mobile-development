import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState('all');

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

  const getTasksStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    return { total, completed, active };
  };

  const filteredTasks = getFilteredTasks();
  const stats = getTasksStats();

  const TaskIcon = "📝";
  const CompletedIcon = "✅";
  const DeleteIcon = "❌";
  const AddIcon = "➕";
  const ClearIcon = "🗑️";

  return (
    <View style={styles.container}>
      {/* Верхняя панель с иконкой */}
      <View style={styles.header}>
        <Text style={styles.title}>🚀 Менеджер задач</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.stats}>
            📊 Всего: <Text style={styles.statsBold}>{stats.total}</Text> | 
            🔵 Активные: <Text style={styles.statsBold}>{stats.active}</Text> | 
            ✅ Выполнены: <Text style={styles.statsBold}>{stats.completed}</Text>
          </Text>
        </View>
      </View>

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
          <Text style={styles.emptySubtext}>Добавьте первую задачу выше!</Text>
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

      {/* Панель управления */}
      <View style={styles.controlPanel}>
        <Text style={styles.filterTitle}>Фильтры:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              🌟 Все
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
            onPress={() => setFilter('active')}
          >
            <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
              🔵 Активные
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
              ✅ Выполненные
            </Text>
          </TouchableOpacity>
        </View>
        
        {stats.completed > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => setTasks(tasks.filter(task => !task.completed))}
          >
            <Text style={styles.clearText}>{ClearIcon} Очистить выполненные</Text>
          </TouchableOpacity>
        )}
      </View>
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
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#2c3e50',
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stats: {
    fontSize: 14,
    textAlign: 'center',
    color: '#7f8c8d',
  },
  statsBold: {
    fontWeight: 'bold',
    color: '#2c3e50',
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
  controlPanel: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
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
    fontSize: 14,
  },
  filterTextActive: {
    color: '#fff',
  },
  clearButton: {
    paddingVertical: 14,
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
    fontSize: 16,
  },
});

export default App;

import { registerRootComponent } from 'expo';
registerRootComponent(App);