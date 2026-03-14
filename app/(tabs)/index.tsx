import React from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CalorieRing } from '../../components/nutritrack/CalorieRing'
import { MacroPill } from '../../components/nutritrack/MacroPill'
import { StatCard } from '../../components/nutritrack/StatCard'
import { MealCard } from '../../components/nutritrack/MealCard'
import { useUserStore, useFoodLogStore, useThemeStore } from '../../stores/nutritrack'
import { theme } from '../../libs/theme'

export default function Dashboard() {
  const { calorieGoal } = useUserStore()
  const { entries } = useFoodLogStore()
  const { isDark } = useThemeStore()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  
  const bgColor = isDark ? theme.colors.bgDark : theme.colors.bgLight
  const textColor = isDark ? theme.colors.white : theme.colors.slate900

  // Calculate generic daily stats 
  const cals = entries.reduce((acc, curr) => acc + curr.calories, 0)
  const protein = entries.reduce((acc, curr) => acc + curr.protein, 0)
  const carbs = entries.reduce((acc, curr) => acc + curr.carbs, 0)
  const fats = entries.reduce((acc, curr) => acc + curr.fat, 0)

  // Math out max hypothetical ring values based on typical daily
  const pPct = protein / 120
  const cPct = carbs / 250
  const fPct = fats / 65

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: bgColor }]} 
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 120 }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.dateText}>MONDAY, MAY 15</Text>
          <Text style={[styles.greeting, { color: textColor }]}>Hello, Sarah 👋</Text>
        </View>
        <Pressable onPress={() => router.push('/(tabs)/profile' as any)} style={styles.settingsBtn}>
          <MaterialIcons name="settings" size={24} color={theme.colors.slate500} />
        </Pressable>
      </View>

      {/* Hero Ring Section */}
      <View style={styles.ringSection}>
        <View style={styles.ringWrapper}>
          <CalorieRing 
            current={cals} total={calorieGoal} 
            protein={pPct} carbs={cPct} fats={fPct} 
          />
          <MacroPill color={theme.colors.violet400} label={`${protein}g Protein`} position={{ top: 8, right: -40 }} />
          <MacroPill color={theme.colors.teal400} label={`${carbs}g Carbs`} position={{ bottom: 48, right: -45 }} />
          <MacroPill color={theme.colors.orange400} label={`${fats}g Fats`} position={{ bottom: 8, left: -40 }} />
        </View>
        <View style={styles.remainRow}>
          <View style={[styles.dot, { backgroundColor: theme.colors.teal400 }]} />
          <Text style={styles.remainText}>
             <Text style={{ fontFamily: 'PublicSans_700Bold', color: textColor }}>{calorieGoal - cals} kcal</Text> remaining · <Text style={{ fontFamily: 'PublicSans_700Bold', color: textColor }}>320</Text> burned
          </Text>
        </View>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard icon="water-drop" iconColor={theme.colors.blue500} value="4 / 8" label="cups water" />
        <StatCard icon="directions-walk" iconColor={theme.colors.green500} value="6,432" label="steps" />
        <StatCard icon="monitor-weight" iconColor={theme.colors.orange500} value="64 kg" label="weight" />
      </View>

      {/* AI Widget */}
      <View style={[styles.aiCard, { backgroundColor: isDark ? 'rgba(236,91,19,0.2)' : 'rgba(236,91,19,0.1)', borderColor: 'rgba(236,91,19,0.25)' }]}>
        <View style={styles.aiIconBg}>
          <MaterialIcons name="lightbulb" size={24} color={theme.colors.white} />
        </View>
        <View style={styles.aiTextContent}>
          <Text style={[styles.aiTitle, { color: textColor }]}>Smart Suggestion</Text>
          <Text style={[styles.aiDesc, { color: isDark ? theme.colors.slate300 : theme.colors.slate600 }]}>
            You usually snack at 4pm. You're {calorieGoal - cals} kcal under goal — prep a healthy option now?
          </Text>
          <Pressable style={styles.aiBtnRow} onPress={() => router.push('/(tabs)/log' as any)}>
            <Text style={styles.aiBtnText}>See suggestions</Text>
            <MaterialIcons name="arrow-forward" size={14} color={theme.colors.primary} />
          </Pressable>
        </View>
      </View>

      {/* Today's Meals */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Today's Meals</Text>
        <Pressable onPress={() => router.push('/(tabs)/log' as any)} style={styles.viewLogBtn}>
          <Text style={styles.viewLogTxt}>View log</Text>
          <MaterialIcons name="chevron-right" size={16} color={theme.colors.primary} />
        </Pressable>
      </View>

      <MealCard 
        mealName="Breakfast" icon="🌅" time="8:30 AM" 
        entries={entries.filter(e => e.meal === 'Breakfast')}
        onAddPress={() => router.push('/(tabs)/scan' as any)}
        onItemPress={() => router.push('/(tabs)/log' as any)}
      />
      <MealCard 
        mealName="Lunch" icon="☀️" time="1:00 PM" 
        entries={entries.filter(e => e.meal === 'Lunch')}
        onAddPress={() => router.push('/(tabs)/scan' as any)}
        onItemPress={() => router.push('/(tabs)/log' as any)}
      />
      <MealCard 
        mealName="Dinner" icon="🌙" 
        entries={entries.filter(e => e.meal === 'Dinner')}
        onAddPress={() => router.push('/(tabs)/scan' as any)}
        onItemPress={() => router.push('/(tabs)/log' as any)}
      />
      <MealCard 
        mealName="Snack" icon="🍎" time="3:00 PM" disabled
        entries={entries.filter(e => e.meal === 'Snack')}
        onAddPress={() => router.push('/(tabs)/scan' as any)}
        onItemPress={() => router.push('/(tabs)/log' as any)}
      />
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
    alignItems: 'flex-start',
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'PublicSans_600SemiBold',
    color: theme.colors.slate400,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'PublicSans_700Bold',
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 190,
  },
  remainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
  },
  remainText: {
    fontSize: 14,
    fontFamily: 'PublicSans_400Regular',
    color: theme.colors.slate500,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  aiCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    gap: 12,
  },
  aiIconBg: {
    backgroundColor: theme.colors.primary,
    padding: 8,
    borderRadius: 8,
  },
  aiTextContent: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 14,
    fontFamily: 'PublicSans_700Bold',
    marginBottom: 2,
  },
  aiDesc: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'PublicSans_400Regular',
    marginBottom: 8,
  },
  aiBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiBtnText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontFamily: 'PublicSans_700Bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'PublicSans_700Bold',
  },
  viewLogBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewLogTxt: {
    fontSize: 14,
    fontFamily: 'PublicSans_600SemiBold',
    color: theme.colors.primary,
  }
})
