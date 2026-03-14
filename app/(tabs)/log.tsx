import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MealCard } from '../../components/nutritrack/MealCard'
import { useFoodLogStore, useThemeStore } from '../../stores/nutritrack'
import { theme } from '../../libs/theme'

export default function FoodLog() {
  const { entries } = useFoodLogStore()
  const { isDark } = useThemeStore()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  
  const [selectedDate, setSelectedDate] = useState(6) // 6 is today in our mock 0-6 array

  const bgColor = isDark ? theme.colors.bgDark : theme.colors.bgLight
  const textColor = isDark ? theme.colors.white : theme.colors.slate900

  // Calculate generic daily stats 
  const cals = entries.reduce((acc, curr) => acc + curr.calories, 0)
  const protein = entries.reduce((acc, curr) => acc + curr.protein, 0)
  const carbs = entries.reduce((acc, curr) => acc + curr.carbs, 0)
  const fats = entries.reduce((acc, curr) => acc + curr.fat, 0)

  // Generate 7 days ending today
  const today = new Date()
  const days = ['S','M','T','W','T','F','S']
  const stripDays = Array.from({length:7}, (_,i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - 6 + i)
    return { day: days[d.getDay()], date: d.getDate(), index: i }
  })

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: bgColor }]} 
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 120 }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Food Log</Text>
        <Pressable style={styles.exportBtn}>
          <MaterialIcons name="ios-share" size={18} color={theme.colors.primary} />
          <Text style={styles.exportTxt}>Export</Text>
        </Pressable>
      </View>

      {/* Date Strip */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateStrip}>
        {stripDays.map((d) => {
          const isSelected = d.index === selectedDate
          return (
            <Pressable 
              key={d.index}
              style={[
                styles.dateBtn,
                isSelected 
                  ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary } 
                  : { backgroundColor: isDark ? theme.colors.slate800 : theme.colors.white, borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }
              ]}
              onPress={() => setSelectedDate(d.index)}
            >
              <Text style={[styles.dayName, isSelected && { color: 'white' }]}>{d.day}</Text>
              <Text style={[styles.dateNum, isSelected && { color: 'white' }, !isSelected && { color: textColor }]}>{d.date}</Text>
            </Pressable>
          )
        })}
      </ScrollView>

      {/* Summary Row */}
      <View style={styles.summaryGrid}>
        <View style={[styles.vCard, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
          <Text style={[styles.vVal, { color: theme.colors.teal500 }]}>{cals.toLocaleString()}</Text>
          <Text style={styles.vLbl}>Calories</Text>
        </View>
        <View style={[styles.vCard, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
          <Text style={[styles.vVal, { color: theme.colors.violet500 }]}>{protein}g</Text>
          <Text style={styles.vLbl}>Protein</Text>
        </View>
        <View style={[styles.vCard, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
          <Text style={[styles.vVal, { color: theme.colors.blue500 }]}>{carbs}g</Text>
          <Text style={styles.vLbl}>Carbs</Text>
        </View>
        <View style={[styles.vCard, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
          <Text style={[styles.vVal, { color: theme.colors.orange500 }]}>{fats}g</Text>
          <Text style={styles.vLbl}>Fat</Text>
        </View>
      </View>

      {/* Meals */}
      <MealCard 
        mealName="Breakfast" icon="🌅" 
        entries={entries.filter(e => e.meal === 'Breakfast')}
        onAddPress={() => router.push('/search' as any)}
        onItemPress={() => {}}
      />
      <MealCard 
        mealName="Lunch" icon="☀️" 
        entries={entries.filter(e => e.meal === 'Lunch')}
        onAddPress={() => router.push('/search' as any)}
        onItemPress={() => {}}
      />
      <MealCard 
        mealName="Dinner" icon="🌙" 
        entries={entries.filter(e => e.meal === 'Dinner')}
        onAddPress={() => router.push('/search' as any)}
        onItemPress={() => {}}
      />

      <Pressable 
        style={({pressed}) => [
          styles.addMoreBtn,
          { borderColor: isDark ? theme.colors.slate600 : theme.colors.slate300 },
          pressed && { opacity: 0.7 }
        ]}
        onPress={() => router.push('/search' as any)}
      >
        <MaterialIcons name="add-circle" size={20} color={theme.colors.primary} />
        <Text style={styles.addMoreTxt}>Add More Food</Text>
      </Pressable>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'PublicSans_700Bold',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exportTxt: {
    fontSize: 14,
    fontFamily: 'PublicSans_600SemiBold',
    color: theme.colors.primary,
  },
  dateStrip: {
    flexDirection: 'row',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dateBtn: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    marginRight: 12,
    minWidth: 54,
  },
  dayName: {
    fontSize: 10,
    fontFamily: 'PublicSans_600SemiBold',
    textTransform: 'uppercase',
    color: theme.colors.slate500,
    marginBottom: 4,
  },
  dateNum: {
    fontSize: 16,
    fontFamily: 'PublicSans_800ExtraBold',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  vCard: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    ...theme.shadows.sm,
  },
  vVal: {
    fontSize: 16,
    fontFamily: 'PublicSans_800ExtraBold',
  },
  vLbl: {
    fontSize: 10,
    marginTop: 2,
    color: theme.colors.slate500,
  },
  addMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 4,
  },
  addMoreTxt: {
    fontSize: 14,
    fontFamily: 'PublicSans_600SemiBold',
    color: theme.colors.slate500,
  }
})
