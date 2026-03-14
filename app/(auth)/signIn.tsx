import { useClerk, useSignIn, useOAuth } from '@clerk/expo'
import * as Linking from 'expo-linking'
import { type Href, Link, useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'

export const useWarmUpBrowser = () => {
    React.useEffect(() => {
        void WebBrowser.warmUpAsync()
        return () => {
            void WebBrowser.coolDownAsync()
        }
    }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function Page() {
    useWarmUpBrowser()
    const { signIn, errors, fetchStatus } = useSignIn()
    const { setActive } = useClerk()
    const router = useRouter()

    const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
    const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({ strategy: 'oauth_apple' })

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [code, setCode] = React.useState('')
    const [socialLoading, setSocialLoading] = React.useState<string | null>(null)

    // Handle OAuth social login
    const handleSocialLogin = async (strategy: 'oauth_google' | 'oauth_apple') => {
        try {
            setSocialLoading(strategy)

            const startOAuthFlow =
                strategy === 'oauth_google' ? startGoogleOAuthFlow : startAppleOAuthFlow

            const { createdSessionId, setActive: setOAuthActive } = await startOAuthFlow({
                redirectUrl: Linking.createURL('/(home)'),
            })

            if (createdSessionId) {
                await setOAuthActive!({ session: createdSessionId })
                router.replace('/(home)' as Href)
            } else {
                // Use signIn or signUp for next steps such as MFA
            }
        } catch (err) {
            console.error('Social login error:', err)
            Alert.alert('Error', 'Failed to start social login. Please try again.')
        } finally {
            setSocialLoading(null)
        }
    }

    const handleSubmit = async () => {
        try {
            const { error } = await signIn.password({
                emailAddress,
                password,
            })
            if (error) {
                console.error(JSON.stringify(error, null, 2))
                return
            }

            if (signIn.status === 'complete') {
                await signIn.finalize({
                    navigate: ({ session, decorateUrl }) => {
                        if (session?.currentTask) {
                            // Handle pending session tasks
                            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
                            console.log(session?.currentTask)
                            return
                        }

                        const url = decorateUrl('/')
                        if (url.startsWith('http')) {
                            window.location.href = url
                        } else {
                            router.push(url as Href)
                        }
                    },
                })
            } else if (signIn.status === 'needs_second_factor' || signIn.status === 'needs_client_trust') {
                // Handle second factor or client trust verification
                // For other second factor strategies,
                // see https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
                // see https://clerk.com/docs/guides/development/custom-flows/authentication/client-trust
                const emailCodeFactor = signIn.supportedSecondFactors.find(
                    (factor) => factor.strategy === 'email_code',
                )

                if (emailCodeFactor) {
                    await signIn.mfa.sendEmailCode()
                }
            } else {
                // Check why the sign-in is not complete
                console.error('Sign-in attempt not complete:', signIn)
            }
        } catch (err: any) {
            console.error('Sign in error:', JSON.stringify(err, null, 2))
        }
    }

    const handleVerify = async () => {
        try {
            await signIn.mfa.verifyEmailCode({ code })

            if (signIn.status === 'complete') {
                await signIn.finalize({
                    navigate: ({ session, decorateUrl }) => {
                        if (session?.currentTask) {
                            // Handle pending session tasks
                            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
                            console.log(session?.currentTask)
                            return
                        }

                        const url = decorateUrl('/')
                        if (url.startsWith('http')) {
                            window.location.href = url
                        } else {
                            router.push(url as Href)
                        }
                    },
                })
            } else {
                // Check why the sign-in is not complete
                console.error('Sign-in attempt not complete:', signIn)
            }
        } catch (err: any) {
            console.error('Verification error:', JSON.stringify(err, null, 2))
        }
    }

    if (signIn.status === 'needs_second_factor' || signIn.status === 'needs_client_trust') {
        return (
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.logoContainer}>
                                <Ionicons name="bar-chart-outline" size={32} color="#2dd4bf" />
                            </View>
                            <Text style={styles.appTitle}>NutriTrack AI</Text>
                            <Text style={styles.appSubtitle}>Verify your identity</Text>
                        </View>

                        {/* Verification Form */}
                        <View style={styles.formSection}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Verification Code</Text>
                                <TextInput
                                    style={styles.input}
                                    value={code}
                                    placeholder="Enter your verification code"
                                    placeholderTextColor="#94a3b8"
                                    onChangeText={(code) => setCode(code)}
                                    keyboardType="numeric"
                                />
                            </View>
                            {errors.fields.code && <Text style={styles.error}>{errors.fields.code.message}</Text>}

                            <Pressable
                                style={({ pressed }) => [
                                    styles.buttonWrapper,
                                    fetchStatus === 'fetching' && styles.buttonDisabled,
                                    pressed && styles.buttonPressed,
                                ]}
                                onPress={handleVerify}
                                disabled={fetchStatus === 'fetching'}
                            >
                                <LinearGradient
                                    colors={['#34d399', '#2dd4bf']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.gradientButton}
                                >
                                    <Text style={styles.buttonText}>Verify</Text>
                                </LinearGradient>
                            </Pressable>

                            <Pressable
                                style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
                                onPress={async () => {
                                    try {
                                        await signIn.mfa.sendEmailCode()
                                    } catch (err: any) {
                                        console.error('Error sending code:', JSON.stringify(err, null, 2))
                                    }
                                }}
                            >
                                <Text style={styles.secondaryButtonText}>I need a new code</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Background Decorative Elements */}
                    <View style={styles.decorativeRing} pointerEvents="none" />

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Ionicons name="bar-chart-outline" size={32} color="#2dd4bf" />
                        </View>
                        <Text style={styles.appTitle}>NutriTrack AI</Text>
                        <Text style={styles.appSubtitle}>Precision nutrition for peak performance</Text>
                    </View>

                    {/* Sign In Form */}
                    <View style={styles.formSection}>
                        {/* Email Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                autoCapitalize="none"
                                value={emailAddress}
                                placeholder="name@example.com"
                                placeholderTextColor="#94a3b8"
                                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                                keyboardType="email-address"
                            />
                        </View>
                        {errors.fields.identifier && (
                            <Text style={styles.error}>{errors.fields.identifier.message}</Text>
                        )}

                        {/* Password Input */}
                        <View style={styles.inputGroup}>
                            <View style={styles.labelRow}>
                                <Text style={styles.label}>Password</Text>
                                <Pressable>
                                    <Text style={styles.forgotText}>Forgot?</Text>
                                </Pressable>
                            </View>
                            <TextInput
                                style={styles.input}
                                value={password}
                                placeholder="••••••••"
                                placeholderTextColor="#94a3b8"
                                secureTextEntry={true}
                                onChangeText={(password) => setPassword(password)}
                            />
                        </View>
                        {errors.fields.password && <Text style={styles.error}>{errors.fields.password.message}</Text>}

                        {/* Submit Button */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.buttonWrapper,
                                (!emailAddress || !password || fetchStatus === 'fetching') && styles.buttonDisabled,
                                pressed && styles.buttonPressed,
                            ]}
                            onPress={handleSubmit}
                            disabled={!emailAddress || !password || fetchStatus === 'fetching'}
                        >
                            <LinearGradient
                                colors={['#34d399', '#2dd4bf']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.buttonText}>Sign In</Text>
                            </LinearGradient>
                        </Pressable>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Buttons */}
                        <View style={styles.socialRow}>
                            <Pressable
                                style={({ pressed }) => [styles.socialButton, pressed && { backgroundColor: '#f8fafc' }]}
                                onPress={() => handleSocialLogin('oauth_google')}
                                disabled={socialLoading !== null}
                            >
                                {socialLoading === 'oauth_google' ? (
                                    <ActivityIndicator size="small" color="#4285F4" />
                                ) : (
                                    <Ionicons name="logo-google" size={20} color="#4285F4" />
                                )}
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [styles.socialButton, pressed && { backgroundColor: '#f8fafc' }]}
                                onPress={() => handleSocialLogin('oauth_apple')}
                                disabled={socialLoading !== null}
                            >
                                {socialLoading === 'oauth_apple' ? (
                                    <ActivityIndicator size="small" color="#000000" />
                                ) : (
                                    <Ionicons name="logo-apple" size={22} color="#000000" />
                                )}
                            </Pressable>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <Link href="/signUp">
                            <Text style={styles.footerLink}>Join the Lab</Text>
                        </Link>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingTop: 20,
        paddingBottom: 40,
    },
    decorativeRing: {
        position: 'absolute',
        top: -60,
        right: -80,
        width: 260,
        height: 260,
        borderRadius: 130,
        borderWidth: 35,
        borderColor: 'rgba(45, 212, 191, 0.06)',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    appTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1e293b',
        letterSpacing: -0.5,
    },
    appSubtitle: {
        fontSize: 15,
        color: '#64748b',
        marginTop: 6,
        fontWeight: '500',
    },
    formSection: {
        width: '100%',
        gap: 16,
    },
    inputGroup: {
        gap: 6,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginLeft: 4,
    },
    forgotText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2dd4bf',
    },
    input: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        fontSize: 16,
        color: '#1e293b',
    },
    buttonWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#2dd4bf',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 5,
    },
    gradientButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    buttonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: '700',
    },
    secondaryButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 4,
    },
    secondaryButtonText: {
        color: '#2dd4bf',
        fontWeight: '600',
        fontSize: 15,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 4,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0',
    },
    dividerText: {
        paddingHorizontal: 16,
        fontSize: 11,
        fontWeight: '600',
        color: '#94a3b8',
        letterSpacing: 1.5,
    },
    socialRow: {
        flexDirection: 'row',
        gap: 16,
    },
    socialButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    footerText: {
        fontSize: 14,
        color: '#64748b',
    },
    footerLink: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2dd4bf',
    },
    error: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: -8,
        marginLeft: 4,
    },
})