import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Platform } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFoodLogStore, useThemeStore } from '../stores/nutritrack'
import { theme } from '../libs/theme'

const FOODS = [
  {e:'🥣',n:'Oatmeal',c:150,m:'C 27g · P 5g · F 3g',cat:'Grains'},
  {e:'🍗',n:'Chicken Breast',c:165,m:'P 31g · F 3.6g · C 0g',cat:'Protein'},
  {e:'🥚',n:'Boiled Egg',c:78,m:'P 6g · F 5g · C 0.6g',cat:'Protein'},
  {e:'🍌',n:'Banana',c:105,m:'C 27g · Fiber 3g · P 1.3g',cat:'Fruits'},
  {e:'🍎',n:'Apple',c:95,m:'C 25g · Fiber 4g · Sugar 19g',cat:'Fruits'},
  {e:'🥛',n:'Whole Milk (1 cup)',c:149,m:'P 8g · F 8g · C 12g',cat:'Dairy'},
  {e:'🧀',n:'Cheddar Cheese',c:113,m:'P 7g · F 9g · C 0.4g',cat:'Dairy'},
  {e:'🥦',n:'Broccoli',c:34,m:'P 2.8g · C 7g · Fiber 2.6g',cat:'Veggies'},
  {e:'🥩',n:'Lean Beef (100g)',c:215,m:'P 26g · F 12g · C 0g',cat:'Protein'},
]

const CATS = ['All','Grains','Protein','Veggies','Fruits','Dairy']

export default function SearchScreen() {
  const { isDark } = useThemeStore()
  const { addEntry } = useFoodLogStore()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('All')

  const bgColor = isDark ? theme.colors.bgDark : theme.colors.bgLight
  const textColor = isDark ? theme.colors.white : theme.colors.slate900

  const filtered = FOODS.filter(f => 
    (cat === 'All' || f.cat === cat) &&
    f.n.toLowerCase().includes(query.toLowerCase())
  )

  const handleAdd = (food: typeof FOODS[0]) => {
    // In a full app, this would open the bottom sheet to select portion and meal.
    // For now we add immediately to Lunch
    addEntry({
      meal: 'Lunch',
      name: food.n,
      emoji: food.e,
      calories: food.c,
      carbs: parseInt(food.m.match(/C (\d+)g/)?.[1] || '0'),
      protein: parseInt(food.m.match(/P (\d+)g/)?.[1] || '0'),
      fat: parseInt(food.m.match(/F (\d+)g/)?.[1] || '0'),
      portion: '1 serving'
    })
    router.back()
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor, paddingTop: Math.max(insets.top, 20), paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={textColor} />
        </Pressable>
        <Text style={[styles.title, { color: textColor }]}>Search Food</Text>
      </View>

      <View style={styles.searchWrap}>
        <MaterialIcons name="search" size={20} color={theme.colors.slate400} style={styles.searchIcon} />
        <TextInput 
          style={[
            styles.searchInput, 
            { 
              backgroundColor: isDark ? theme.colors.slate800 : 'white',
              color: textColor,
              borderColor: isDark ? theme.colors.slate700 : theme.colors.slate200
            }
          ]}
          placeholder="Search foods, dishes, brands..."
          placeholderTextColor={theme.colors.slate400}
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catPad}>
        {CATS.map(c => {
          const active = c === cat
          return (
            <Pressable 
              key={c}
              onPress={() => setCat(c)}
              style={[
                styles.chip,
                active 
                  ? { backgroundColor: 'rgba(236,91,19,0.1)', borderColor: theme.colors.primary }
                  : { borderColor: isDark ? theme.colors.slate700 : theme.colors.slate200 }
              ]}
            >
              <Text style={[
                styles.chipTxt,
                active ? { color: theme.colors.primary } : { color: isDark ? theme.colors.slate400 : theme.colors.slate500 }
              ]}>{c}</Text>
            </Pressable>
          )
        })}
      </ScrollView>

      <ScrollView style={styles.list}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
            <Text style={{ color: theme.colors.slate400, fontFamily: 'PublicSans_600SemiBold' }}>No results found</Text>
          </View>
        ) : (
          filtered.map((f, i) => (
            <Pressable 
              key={i} 
              style={[styles.row, { borderBottomColor: isDark ? theme.colors.slate800 : theme.colors.slate100 }]}
              onPress={() => handleAdd(f)}
            >
              <View style={[styles.emojiWrap, { backgroundColor: isDark ? theme.colors.slate800 : theme.colors.slate100 }]}>
                <Text style={styles.emoji}>{f.e}</Text>
              </View>
              <View style={styles.info}>
                <Text style={[styles.foodName, { color: textColor }]}>{f.n}</Text>
                <Text style={styles.foodMac}>{f.m}</Text>
              </View>
              <View style={styles.calBox}>
                <Text style={styles.foodCal}>{f.c}</Text>
                <Text style={styles.foodKcal}>kcal</Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  backBtn: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: 'PublicSans_700Bold',
    marginLeft: 8,
  },
  searchWrap: {
    position: 'relative',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 36,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    height: 48,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    paddingLeft: 44,
    paddingRight: 16,
    fontSize: 14,
    fontFamily: 'PublicSans_400Regular',
    ...theme.shadows.sm,
  },
  catScroll: {
    maxHeight: 40,
    marginBottom: 16,
  },
  catPad: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1.5,
  },
  chipTxt: {
    fontSize: 13,
    fontFamily: 'PublicSans_600SemiBold',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  emojiWrap: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  foodName: {
    fontSize: 14,
    fontFamily: 'PublicSans_600SemiBold',
  },
  foodMac: {
    fontSize: 12,
    fontFamily: 'PublicSans_400Regular',
    color: theme.colors.slate400,
    marginTop: 2,
  },
  calBox: {
    alignItems: 'flex-end',
  },
  foodCal: {
    fontSize: 16,
    fontFamily: 'PublicSans_800ExtraBold',
    color: theme.colors.primary,
  },
  foodKcal: {
    fontSize: 10,
    color: theme.colors.slate400,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  }
})
