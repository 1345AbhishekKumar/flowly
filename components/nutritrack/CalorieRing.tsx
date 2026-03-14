import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  Easing 
} from 'react-native-reanimated'
import { useThemeStore } from '../../stores/nutritrack'
import { theme } from '../../libs/theme'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface CalorieRingProps {
  current: number
  total: number
  protein: number // percentage 0-1
  carbs: number // percentage 0-1
  fats: number // percentage 0-1
  size?: number
  strokeWidth?: number
}

export function CalorieRing({ 
  current, 
  total, 
  protein, 
  carbs, 
  fats, 
  size = 190, 
  strokeWidth = 10 
}: CalorieRingProps) {
  const { isDark } = useThemeStore()
  
  const radius = (size - strokeWidth * 2) / 2
  const circumference = radius * 2 * Math.PI
  
  // Outer progress ring
  const progressPercent = Math.min(current / total, 1)
  const progressOffset = useSharedValue(circumference)
  
  // Inner macronutrient arcs
  const pRadius = radius - 14
  const pCircum = pRadius * 2 * Math.PI
  const pOffset = useSharedValue(pCircum)
  
  const fRadius = radius - 28
  const fCircum = fRadius * 2 * Math.PI
  const fOffset = useSharedValue(fCircum)

  useEffect(() => {
    progressOffset.value = withTiming(circumference - (progressPercent * circumference), { duration: 1200, easing: Easing.bezier(0.22, 0.68, 0, 1.2) })
    pOffset.value = withTiming(pCircum - (protein * pCircum), { duration: 1200, easing: Easing.bezier(0.22, 0.68, 0, 1.2) })
    fOffset.value = withTiming(fCircum - (fats * fCircum), { duration: 1200, easing: Easing.bezier(0.22, 0.68, 0, 1.2) })
  }, [current, protein, fats])

  const animatedProgressProps = useAnimatedProps(() => ({ strokeDashoffset: progressOffset.value }))
  const animatedProteinProps = useAnimatedProps(() => ({ strokeDashoffset: pOffset.value }))
  const animatedFatsProps = useAnimatedProps(() => ({ strokeDashoffset: fOffset.value }))
  
  const trackColor = isDark ? theme.colors.slate800 : theme.colors.slate200
  const textColor = isDark ? theme.colors.white : theme.colors.slate900

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={styles.svg}>
        {/* Track */}
        <Circle cx={`${size/2}`} cy={`${size/2}`} r={`${radius}`} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        
        {/* Calorie Arc */}
        <AnimatedCircle 
          cx={`${size/2}`} cy={`${size/2}`} r={`${radius}`} 
          fill="none" stroke={theme.colors.teal400} 
          strokeWidth={strokeWidth} strokeLinecap="round" 
          strokeDasharray={`${circumference}`} animatedProps={animatedProgressProps} 
        />
        
        {/* Protein Arc */}
        <AnimatedCircle 
          cx={`${size/2}`} cy={`${size/2}`} r={`${pRadius}`} 
          fill="none" stroke={theme.colors.violet400} 
          strokeWidth={7} strokeLinecap="round" 
          strokeDasharray={`${pCircum}`} animatedProps={animatedProteinProps} 
        />
        
        {/* Fat Arc */}
        <AnimatedCircle 
          cx={`${size/2}`} cy={`${size/2}`} r={`${fRadius}`} 
          fill="none" stroke={theme.colors.orange400} 
          strokeWidth={7} strokeLinecap="round" 
          strokeDasharray={`${fCircum}`} animatedProps={animatedFatsProps} 
        />
      </Svg>

      <View style={styles.centerText}>
        <Text style={[styles.mainKcal, { color: textColor }]}>{current.toLocaleString()}</Text>
        <Text style={styles.label}>KCAL TODAY</Text>
        <Text style={styles.subLabel}>of {total.toLocaleString()}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  mainKcal: {
    fontSize: 38,
    fontFamily: 'PublicSans_300Light',
    lineHeight: 44,
    letterSpacing: -1,
  },
  label: {
    fontSize: 11,
    fontFamily: 'PublicSans_700Bold',
    color: theme.colors.slate400,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  subLabel: {
    fontSize: 10,
    fontFamily: 'PublicSans_400Regular',
    color: theme.colors.slate400,
    marginTop: 2,
  },
})
