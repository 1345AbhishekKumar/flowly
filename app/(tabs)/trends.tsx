import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useThemeStore } from '../../stores/nutritrack'
import { theme } from '../../libs/theme'

export default function TrendsScreen() {
  const { isDark } = useThemeStore()
  const [range, setRange] = useState('7d')
  const insets = useSafeAreaInsets()

  const bgColor = isDark ? theme.colors.bgDark : theme.colors.bgLight
  const textColor = isDark ? theme.colors.white : theme.colors.slate900

  // Mock Data
  const weekData = [
    {d:'Sun',v:1980},{d:'Mon',v:2240},{d:'Tue',v:1750},{d:'Wed',v:2100},
    {d:'Thu',v:1890},{d:'Fri',v:2050},{d:'Sat',v:1432},
  ]
  const maxCal = Math.max(...weekData.map(d=>d.v))
  const avgCal = Math.round(weekData.reduce((acc, curr) => acc + curr.v, 0) / 7)

  // Macro Ring Calcs
  const cCircum = 2 * Math.PI * 30
  const cPct = 0.48, pPct = 0.29, fPct = 0.23
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: bgColor }]} 
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 120 }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Trends</Text>
        <View style={[styles.rangeGroup, { borderColor: isDark ? theme.colors.slate700 : theme.colors.slate200 }]}>
          <Pressable onPress={() => setRange('7d')} style={[styles.rangeBtn, range === '7d' && styles.rangeBtnActive]}>
            <Text style={[styles.rangeTxt, range === '7d' ? styles.rangeTxtActive : { color: isDark ? theme.colors.slate400 : theme.colors.slate500 }]}>7D</Text>
          </Pressable>
          <Pressable onPress={() => setRange('30d')} style={[styles.rangeBtn, range === '30d' && styles.rangeBtnActive]}>
            <Text style={[styles.rangeTxt, range === '30d' ? styles.rangeTxtActive : { color: isDark ? theme.colors.slate400 : theme.colors.slate500 }]}>30D</Text>
          </Pressable>
          <Pressable onPress={() => setRange('3m')} style={[styles.rangeBtn, range === '3m' && styles.rangeBtnActive]}>
            <Text style={[styles.rangeTxt, range === '3m' ? styles.rangeTxtActive : { color: isDark ? theme.colors.slate400 : theme.colors.slate500 }]}>3M</Text>
          </Pressable>
        </View>
      </View>

      {/* Calorie Bar Chart */}
      <View style={[styles.card, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardKicker}>CALORIE INTAKE</Text>
            <Text style={[styles.cardVal, { color: textColor }]}>{avgCal.toLocaleString()} <Text style={styles.cardValSub}>avg / day</Text></Text>
          </View>
          <View style={[styles.pill, { backgroundColor: 'rgba(34,197,94,0.12)' }]}>
            <Text style={[styles.pillTxt, { color: theme.colors.green500 }]}>↓ 240 vs goal</Text>
          </View>
        </View>
        <View style={styles.barArea}>
          {weekData.map((d, i) => {
            const h = Math.round((d.v/maxCal)*80)
            const over = d.v > 2000
            const isToday = i === 6
            const color = isToday ? theme.colors.primary : over ? theme.colors.red400 : theme.colors.teal400
            return (
              <View key={i} style={styles.barCol}>
                <View style={[styles.barFill, { height: h, backgroundColor: color }]} />
              </View>
            )
          })}
        </View>
        <View style={styles.barLabels}>
          {weekData.map((d, i) => (
            <Text key={i} style={styles.barLblTxt}>{d.d}</Text>
          ))}
        </View>
      </View>

      {/* Weight Chart SVG */}
      <View style={[styles.card, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardKicker}>WEIGHT</Text>
            <Text style={[styles.cardVal, { color: textColor }]}>64.0 <Text style={styles.cardValSub}>kg current</Text></Text>
          </View>
          <View style={[styles.pill, { backgroundColor: 'rgba(45,212,191,0.12)' }]}>
            <Text style={[styles.pillTxt, { color: theme.colors.teal500 }]}>↓ 1.5kg this week</Text>
          </View>
        </View>
        
        <View style={styles.svgWrap}>
          <Svg viewBox="0 0 300 80" style={{ width: '100%', height: 80 }} preserveAspectRatio="none">
            <Defs>
              <SvgLinearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.3" />
                <Stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
              </SvgLinearGradient>
            </Defs>
            <Path d="M0,50 C40,45 80,36 120,38 C160,40 200,32 240,26 L270,22 L270,80 L0,80 Z" fill="url(#wGrad)" />
            <Path d="M0,50 C40,45 80,36 120,38 C160,40 200,32 240,26 L270,22" fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" />
            <Circle cx="270" cy="22" r="4" fill="#2dd4bf" />
          </Svg>
        </View>
        <View style={styles.wLabels}>
          <Text style={styles.wLblTxt}>65.5 kg</Text>
          <Text style={styles.wLblTxt}>Start of week</Text>
          <Text style={styles.wLblTxt}>64.0 kg</Text>
        </View>
      </View>

      {/* Macro Donut */}
      <View style={[styles.card, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
        <Text style={[styles.cardKicker, { marginBottom: 16 }]}>MACRO DISTRIBUTION (AVG)</Text>
        <View style={styles.macroRow}>
          <Svg width={90} height={90} viewBox="0 0 80 80">
            <Circle cx={40} cy={40} r={30} fill="none" stroke={isDark ? theme.colors.slate900 : theme.colors.slate200} strokeWidth={12} />
            <Circle cx={40} cy={40} r={30} fill="none" stroke={theme.colors.teal400} strokeWidth={12} strokeDasharray={`${cCircum}`} strokeDashoffset={`${cCircum * (1 - cPct)}`} rotation="-90" origin="40, 40" />
            <Circle cx={40} cy={40} r={30} fill="none" stroke={theme.colors.violet400} strokeWidth={12} strokeDasharray={`${cCircum}`} strokeDashoffset={`${cCircum * (1 - pPct)}`} rotation="82" origin="40, 40" />
            <Circle cx={40} cy={40} r={30} fill="none" stroke={theme.colors.orange400} strokeWidth={12} strokeDasharray={`${cCircum}`} strokeDashoffset={`${cCircum * (1 - fPct)}`} rotation="191" origin="40, 40" />
          </Svg>
          
          <View style={styles.macroList}>
            <View style={styles.macroItemRow}>
              <View style={styles.macroDotWrap}><View style={[styles.macroDot, {backgroundColor: theme.colors.teal400}]} /><Text style={[styles.macroName, { color: textColor }]}>Carbs</Text></View>
              <View style={styles.macroValWrap}><Text style={[styles.macroPct, { color: textColor }]}>48%</Text><Text style={styles.macroGram}>142g</Text></View>
            </View>
            <View style={styles.macroItemRow}>
              <View style={styles.macroDotWrap}><View style={[styles.macroDot, {backgroundColor: theme.colors.violet400}]} /><Text style={[styles.macroName, { color: textColor }]}>Protein</Text></View>
              <View style={styles.macroValWrap}><Text style={[styles.macroPct, { color: textColor }]}>29%</Text><Text style={styles.macroGram}>86g</Text></View>
            </View>
            <View style={styles.macroItemRow}>
              <View style={styles.macroDotWrap}><View style={[styles.macroDot, {backgroundColor: theme.colors.orange400}]} /><Text style={[styles.macroName, { color: textColor }]}>Fat</Text></View>
              <View style={styles.macroValWrap}><Text style={[styles.macroPct, { color: textColor }]}>23%</Text><Text style={styles.macroGram}>38g</Text></View>
            </View>
          </View>
        </View>
      </View>

      {/* Streak Grid */}
      <View style={[styles.card, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
        <View style={styles.streakHeader}>
          <Text style={styles.cardKicker}>LOGGING STREAK 🔥</Text>
          <View style={[styles.pill, { backgroundColor: 'rgba(251,146,60,0.15)' }]}>
            <Text style={[styles.pillTxt, { color: '#ea580c' }]}>12 days</Text>
          </View>
        </View>
        <View style={styles.streakGrid}>
          {['S','M','T','W','T','F','S'].map((d, i) => {
            const done = i < 6
            const tod = i === 6
            return (
              <View key={i} style={[
                styles.streakBox, 
                tod ? { backgroundColor: theme.colors.primary } : 
                done ? { backgroundColor: 'rgba(236,91,19,0.15)', borderColor: 'rgba(236,91,19,0.25)', borderWidth: 1 } :
                { backgroundColor: isDark ? theme.colors.slate900 : theme.colors.slate100 }
              ]}>
                <Text style={[
                  styles.streakBoxTxt,
                  tod ? { color: 'white' } :
                  done ? { color: theme.colors.primary } : 
                  { color: theme.colors.slate400 }
                ]}>{d}</Text>
              </View>
            )
          })}
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
  rangeGroup: {
    flexDirection: 'row',
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  rangeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rangeBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  rangeTxt: {
    fontSize: 12,
    fontFamily: 'PublicSans_600SemiBold',
  },
  rangeTxtActive: {
    color: 'white',
  },
  card: {
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardKicker: {
    fontSize: 10,
    fontFamily: 'PublicSans_700Bold',
    color: theme.colors.slate400,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  cardVal: {
    fontSize: 24,
    fontFamily: 'PublicSans_800ExtraBold',
  },
  cardValSub: {
    fontSize: 14,
    fontFamily: 'PublicSans_400Regular',
    color: theme.colors.slate400,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  pillTxt: {
    fontSize: 11,
    fontFamily: 'PublicSans_600SemiBold',
  },
  barArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 96,
    gap: 6,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barFill: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 4,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  barLblTxt: {
    fontSize: 10,
    fontFamily: 'PublicSans_400Regular',
    color: theme.colors.slate400,
    textAlign: 'center',
    flex: 1,
  },
  svgWrap: {
    height: 80,
    width: '100%',
  },
  wLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  wLblTxt: {
    fontSize: 12,
    fontFamily: 'PublicSans_400Regular',
    color: theme.colors.slate400,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  macroList: {
    flex: 1,
    gap: 8,
  },
  macroItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroDotWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  macroDot: {
    width: 10, height: 10, borderRadius: 5,
  },
  macroName: {
    fontSize: 14,
    fontFamily: 'PublicSans_400Regular',
  },
  macroValWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroPct: {
    fontSize: 14,
    fontFamily: 'PublicSans_700Bold',
  },
  macroGram: {
    fontSize: 12,
    fontFamily: 'PublicSans_400Regular',
    color: theme.colors.slate400,
    marginLeft: 6,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakBoxTxt: {
    fontSize: 12,
    fontFamily: 'PublicSans_700Bold',
  }
})
