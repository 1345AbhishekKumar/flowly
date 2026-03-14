import React from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Switch } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUserStore, useThemeStore } from '../../stores/nutritrack'
import { theme } from '../../libs/theme'

export default function ProfileScreen() {
  const { isDark, toggleDark } = useThemeStore()
  const { name, email, age, weight, height, streak } = useUserStore()
  const insets = useSafeAreaInsets()

  const bgColor = isDark ? theme.colors.bgDark : theme.colors.bgLight
  const textColor = isDark ? theme.colors.white : theme.colors.slate900

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: bgColor }]} 
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 120 }]}
    >
      
      {/* Profile Card */}
      <View style={[styles.profileCard, { backgroundColor: isDark ? 'rgba(236,91,19,0.1)' : 'rgba(236,91,19,0.05)', borderColor: 'rgba(236,91,19,0.2)' }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTxt}>{name[0]}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.nameTxt, { color: textColor }]}>{name}</Text>
          <Text style={styles.emailTxt}>{email}</Text>
          <View style={styles.tagRow}>
            <View style={[styles.tag, { backgroundColor: 'rgba(236,91,19,0.12)' }]}>
              <Text style={[styles.tagTxt, { color: '#c04c0f' }]}>Pro Plan</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: 'rgba(45,212,191,0.12)' }]}>
              <Text style={[styles.tagTxt, { color: '#0d9488' }]}>🔥 {streak} day streak</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
          <Text style={[styles.statVal, { color: theme.colors.primary }]}>{age}</Text>
          <Text style={styles.statLbl}>Years old</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
          <Text style={[styles.statVal, { color: textColor }]}>{weight} kg</Text>
          <Text style={styles.statLbl}>Weight</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
          <Text style={[styles.statVal, { color: textColor }]}>{height} cm</Text>
          <Text style={styles.statLbl}>Height</Text>
        </View>
      </View>

      {/* Settings Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GOALS & NUTRITION</Text>
        <View style={styles.settingsGroup}>
          <Pressable style={[styles.settingItem, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
            <MaterialIcons name="flag" size={24} color={theme.colors.primary} />
            <View style={styles.settingText}>
              <Text style={[styles.settingName, { color: textColor }]}>Daily Calorie Goal</Text>
              <Text style={styles.settingDesc}>2,000 kcal · Lose weight</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.slate300} />
          </Pressable>
          <Pressable style={[styles.settingItem, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
            <MaterialIcons name="pie-chart" size={24} color={theme.colors.violet500} />
            <View style={styles.settingText}>
              <Text style={[styles.settingName, { color: textColor }]}>Macro Targets</Text>
              <Text style={styles.settingDesc}>Carbs 50% · Protein 30% · Fat 20%</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.slate300} />
          </Pressable>
          <Pressable style={[styles.settingItem, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
            <MaterialIcons name="eco" size={24} color={theme.colors.green500} />
            <View style={styles.settingText}>
              <Text style={[styles.settingName, { color: textColor }]}>Diet Preferences</Text>
              <Text style={styles.settingDesc}>High Protein, Low Carb</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.slate300} />
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <View style={styles.settingsGroup}>
          <View style={[styles.settingItem, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
            <MaterialIcons name="dark-mode" size={24} color={theme.colors.amber500} />
            <View style={styles.settingText}>
              <Text style={[styles.settingName, { color: textColor }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleDark}
              trackColor={{ false: theme.colors.slate300, true: theme.colors.primary }}
              thumbColor={Platform.OS === 'android' ? isDark ? '#fff' : '#f4f3f4' : ''}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>
          <Pressable style={[styles.settingItem, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
            <MaterialIcons name="straighten" size={24} color={theme.colors.blue500} />
            <View style={styles.settingText}>
              <Text style={[styles.settingName, { color: textColor }]}>Units</Text>
              <Text style={styles.settingDesc}>Metric (kg, cm)</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.slate300} />
          </Pressable>
          <View style={[styles.settingItem, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
            <MaterialIcons name="notifications" size={24} color={theme.colors.orange500} />
            <View style={styles.settingText}>
              <Text style={[styles.settingName, { color: textColor }]}>Meal Reminders</Text>
              <Text style={styles.settingDesc}>3x daily · 8am, 1pm, 7pm</Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: theme.colors.slate300, true: theme.colors.primary }}
              thumbColor={Platform.OS === 'android' ? '#fff' : ''}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATA</Text>
        <View style={styles.settingsGroup}>
          <Pressable style={[styles.settingItem, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
            <MaterialIcons name="download" size={24} color={theme.colors.slate500} />
            <View style={styles.settingText}>
              <Text style={[styles.settingName, { color: textColor }]}>Export Food Log</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.slate300} />
          </Pressable>
          <Pressable style={[styles.settingItem, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
            <MaterialIcons name="share" size={24} color={theme.colors.slate500} />
            <View style={styles.settingText}>
              <Text style={[styles.settingName, { color: textColor }]}>Share Progress</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.slate300} />
          </Pressable>
        </View>
      </View>

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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    marginBottom: 20,
  },
  avatar: {
    width: 64, height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarTxt: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'PublicSans_800ExtraBold',
  },
  profileInfo: {
    flex: 1,
  },
  nameTxt: {
    fontSize: 18,
    fontFamily: 'PublicSans_700Bold',
  },
  emailTxt: {
    fontSize: 14,
    color: theme.colors.slate400,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  tagTxt: {
    fontSize: 11,
    fontFamily: 'PublicSans_600SemiBold',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    ...theme.shadows.sm,
  },
  statVal: {
    fontSize: 18,
    fontFamily: 'PublicSans_800ExtraBold',
  },
  statLbl: {
    fontSize: 10,
    marginTop: 2,
    color: theme.colors.slate500,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'PublicSans_700Bold',
    color: theme.colors.slate400,
    letterSpacing: 1.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingsGroup: {
    gap: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    ...theme.shadows.sm,
  },
  settingText: {
    flex: 1,
    marginLeft: 12,
  },
  settingName: {
    fontSize: 14,
    fontFamily: 'PublicSans_600SemiBold',
  },
  settingDesc: {
    fontSize: 12,
    color: theme.colors.slate400,
    marginTop: 2,
  }
})
