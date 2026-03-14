import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, Platform, ScrollView } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing,
  withSequence,
  withSpring
} from 'react-native-reanimated'
import { useFoodLogStore, useThemeStore } from '../../stores/nutritrack'
import { theme } from '../../libs/theme'

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  
  const { addEntry } = useFoodLogStore()
  const { isDark } = useThemeStore()
  const insets = useSafeAreaInsets()

  // Scanning laser animation
  const scanLineOffset = useSharedValue(0)
  
  useEffect(() => {
    scanLineOffset.value = withRepeat(
      withSequence(
        withTiming(150, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    )
  }, [])

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineOffset.value }]
  }))

  const simulateScan = () => {
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setScanned(true)
    }, 1800)
  }

  const handleAdd = () => {
    addEntry({ meal: 'Dinner', name: 'Steamed Rice', emoji: '🍚', calories: 200, carbs: 45, protein: 4, fat: 0, portion: '~200g' })
    addEntry({ meal: 'Dinner', name: 'Chicken Curry', emoji: '🍛', calories: 250, carbs: 10, protein: 25, fat: 12, portion: '~150g' })
    addEntry({ meal: 'Dinner', name: 'Stir-Fried Veggies', emoji: '🥬', calories: 80, carbs: 15, protein: 3, fat: 1, portion: '~100g' })
    setScanned(false)
  }

  if (!permission) return <View style={styles.container} />

  const textColor = isDark ? theme.colors.white : theme.colors.slate900

  return (
    <View style={[styles.container, { backgroundColor: isDark ? theme.colors.bgDark : theme.colors.bgLight }]}>
      
      {/* Top Camera Viewer */}
      <View style={styles.cameraBox}>
        {permission.granted ? (
          <CameraView style={StyleSheet.absoluteFillObject} facing="back" />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, styles.mockCam]}>
            <Text style={styles.mockCamEmoji}>🍛</Text>
          </View>
        )}

        {/* Overlays */}
        <View style={styles.overlayCenter}>
          <View style={styles.frame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            <Animated.View style={[styles.scanLine, scanLineStyle]} />
          </View>
        </View>

        <View style={[styles.topControls, { top: Math.max(insets.top, 16) }]}>
          <View style={styles.camPill}>
            <Text style={styles.camPillTxt}>📷 Point at your meal</Text>
          </View>
          <View style={styles.controlRow}>
            <Pressable style={styles.circleBtn}>
              <MaterialIcons name="bolt" size={20} color="white" />
            </Pressable>
            <Pressable style={styles.circleBtn}>
              <MaterialIcons name="photo-library" size={20} color="white" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Capture Action Row */}
      <View style={[styles.captureRow, { backgroundColor: isDark ? theme.colors.slate900 : 'white', borderBottomColor: isDark ? theme.colors.slate800 : theme.colors.slate100 }]}>
        <Pressable style={[styles.sideAction, { backgroundColor: isDark ? theme.colors.slate800 : theme.colors.slate100 }]}>
          <MaterialIcons name="photo-library" size={22} color={theme.colors.slate500} />
        </Pressable>

        <Pressable 
          style={({pressed}) => [styles.captureBtnWrap, { borderColor: isDark ? theme.colors.slate600 : theme.colors.slate300, backgroundColor: isDark ? theme.colors.slate900 : 'white' }, pressed && {transform:[{scale: 0.9}]}]}
          onPress={!permission.granted ? requestPermission : simulateScan}
        >
          <View style={styles.captureBtnInner} />
        </Pressable>

        <Pressable style={[styles.sideAction, { backgroundColor: isDark ? theme.colors.slate800 : theme.colors.slate100 }]}>
          <MaterialIcons name="flip-camera-ios" size={22} color={theme.colors.slate500} />
        </Pressable>
      </View>

      {/* AI Results vs Tips View */}
      <ScrollView contentContainerStyle={[styles.bottomArea, { paddingBottom: insets.bottom + 120 }]}>
        {scanned ? (
          <View style={[styles.aiResult, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
            
            <View style={[styles.aiHeader, { backgroundColor: isDark ? 'rgba(20,184,166,0.1)' : theme.colors.teal400 + '15', borderBottomColor: isDark ? 'rgba(20,184,166,0.2)' : theme.colors.teal400 + '30' }]}>
              <View>
                <Text style={styles.aiResultTitle}>🤖 AI Detected 3 items</Text>
                <Text style={styles.aiResultSub}>87% confidence · Edit before saving</Text>
              </View>
              <View style={styles.pillTag}>
                <Text style={styles.pillTagTxt}>✓ Good</Text>
              </View>
            </View>

            <View style={styles.itemList}>
              <View style={[styles.itemRow, { borderBottomColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
                <Text style={styles.itemEmoji}>🍚</Text>
                <View style={{flex: 1}}>
                  <Text style={[styles.itemText, { color: textColor }]}>Steamed Rice</Text>
                  <Text style={styles.itemSub}>~200g · 94% match</Text>
                </View>
                <Text style={styles.itemCals}>200 kcal</Text>
              </View>
              <View style={[styles.itemRow, { borderBottomColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
                <Text style={styles.itemEmoji}>🍛</Text>
                <View style={{flex: 1}}>
                  <Text style={[styles.itemText, { color: textColor }]}>Chicken Curry</Text>
                  <Text style={styles.itemSub}>~150g · 91% match</Text>
                </View>
                <Text style={styles.itemCals}>250 kcal</Text>
              </View>
              <View style={[styles.itemRow, { borderBottomColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
                <Text style={styles.itemEmoji}>🥬</Text>
                <View style={{flex: 1}}>
                  <Text style={[styles.itemText, { color: textColor }]}>Stir-Fried Veggies</Text>
                  <Text style={styles.itemSub}>~100g · 88% match</Text>
                </View>
                <Text style={styles.itemCals}>80 kcal</Text>
              </View>
            </View>

            <View style={[styles.aiFooter, { backgroundColor: isDark ? 'rgba(51,65,85,0.5)' : theme.colors.slate50 }]}>
              <View>
                <Text style={styles.totalLbl}>Total estimated</Text>
                <Text style={[styles.totalNum, { color: textColor }]}>530 <Text style={styles.totalKcal}>kcal</Text></Text>
              </View>
              <View style={styles.actionRow}>
                <Pressable style={[styles.editBtn, { borderColor: isDark ? theme.colors.slate600 : theme.colors.slate200 }]}>
                  <Text style={[styles.editTxt, { color: textColor }]}>Edit</Text>
                </Pressable>
                <Pressable style={styles.addBtn} onPress={handleAdd}>
                  <Text style={styles.addTxt}>Add to Dinner</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.tipBox, { backgroundColor: isDark ? theme.colors.slate800 : 'white', borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 }]}>
            <Text style={[styles.tipTitle, { color: textColor }]}>📸 Scanning Tips</Text>
            <View style={styles.tipList}>
              <View style={styles.tipItem}><Text style={styles.tipNum}>1.</Text><Text style={[styles.tipTxt, { color: isDark ? theme.colors.slate400 : theme.colors.slate500 }]}>Place food on a flat, well-lit surface</Text></View>
              <View style={styles.tipItem}><Text style={styles.tipNum}>2.</Text><Text style={[styles.tipTxt, { color: isDark ? theme.colors.slate400 : theme.colors.slate500 }]}>Keep camera 20-30 cm away from plate</Text></View>
              <View style={styles.tipItem}><Text style={styles.tipNum}>3.</Text><Text style={[styles.tipTxt, { color: isDark ? theme.colors.slate400 : theme.colors.slate500 }]}>Avoid strong shadows for best accuracy</Text></View>
              <View style={styles.tipItem}><Text style={styles.tipNum}>4.</Text><Text style={[styles.tipTxt, { color: isDark ? theme.colors.slate400 : theme.colors.slate500 }]}>Works best with common meals and dishes</Text></View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraBox: {
    height: 320,
    backgroundColor: '#0f172a',
    position: 'relative',
    overflow: 'hidden',
  },
  mockCam: {
    backgroundColor: '#1a2030',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockCamEmoji: {
    fontSize: 72,
  },
  overlayCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  frame: {
    width: 208,
    height: 208,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#2dd4bf',
    borderWidth: 0,
  },
  tl: { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 4 },
  tr: { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 4 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 4 },
  br: { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 4 },
  scanLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: '#2dd4bf',
    shadowColor: '#2dd4bf',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  topControls: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  camPill: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  camPillTxt: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'PublicSans_600SemiBold',
  },
  controlRow: {
    flexDirection: 'row',
    gap: 8,
  },
  circleBtn: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  sideAction: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtnWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  captureBtnInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
  },
  bottomArea: {
    padding: 20,
  },
  aiResult: {
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  aiHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  aiResultTitle: {
    fontSize: 14,
    fontFamily: 'PublicSans_700Bold',
    color: '#115e59',
  },
  aiResultSub: {
    fontSize: 12,
    fontFamily: 'PublicSans_400Regular',
    color: '#0d9488',
    marginTop: 2,
  },
  pillTag: {
    backgroundColor: 'rgba(45,212,191,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  pillTagTxt: {
    color: '#0d9488',
    fontSize: 11,
    fontFamily: 'PublicSans_600SemiBold',
  },
  itemList: {
    paddingHorizontal: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  itemEmoji: {
    fontSize: 20,
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'PublicSans_600SemiBold',
  },
  itemSub: {
    fontSize: 12,
    color: theme.colors.slate400,
    fontFamily: 'PublicSans_400Regular',
  },
  itemCals: {
    fontSize: 14,
    fontFamily: 'PublicSans_700Bold',
    color: theme.colors.primary,
  },
  aiFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLbl: {
    fontSize: 12,
    color: theme.colors.slate500,
  },
  totalNum: {
    fontSize: 18,
    fontFamily: 'PublicSans_800ExtraBold',
  },
  totalKcal: {
    fontSize: 12,
    fontFamily: 'PublicSans_400Regular',
    color: theme.colors.slate400,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  editTxt: {
    fontSize: 12,
    fontFamily: 'PublicSans_600SemiBold',
  },
  addBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
  },
  addTxt: {
    fontSize: 12,
    fontFamily: 'PublicSans_600SemiBold',
    color: 'white',
  },
  tipBox: {
    padding: 16,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontFamily: 'PublicSans_700Bold',
    marginBottom: 12,
  },
  tipList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipNum: {
    fontSize: 12,
    fontFamily: 'PublicSans_700Bold',
    color: theme.colors.primary,
    marginTop: 2,
  },
  tipTxt: {
    fontSize: 12,
    fontFamily: 'PublicSans_400Regular',
    lineHeight: 18,
  }
})
