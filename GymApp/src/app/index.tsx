import { Card } from '@/components/card';
import { LogoBadge } from '@/components/logobadge';
import { OrangeHue } from '@/components/orangehue';
import { colors, fonts, spacing } from '@/constants/theme';
import { Ionicons } from "@expo/vector-icons";
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

export default function Index() {
  const [username,setUsername]= useState('')
  const [email,setEmail]= useState('')
  const [password,setPassword] =useState('')
  const [isSignIn, setIsSignIn] = useState(true);
  const onSignIn =():void =>{
    console.log('sign in',email,password);
  }
  const onSignUp =():void =>{
    console.log('sign up',email,password,username);
  }
  const onForgotPassword =():void =>{
    console.log('forgot password');
  }
  return (
    <View style={{backgroundColor:colors.background,flex:1,justifyContent:'flex-start',padding:spacing.md}}>
      <OrangeHue/>

      <View style={{
        position: "absolute",
        top: -120, right: -80,
        width: 300, height: 300, borderRadius: 150,
        borderWidth: 2,
        borderColor: "rgba(255,90,31,0.18)",
      }} />

      {/* ring 2 — smaller, concentric-ish, slightly offset */}
      <View style={{
        position: "absolute",
        top: -35, right: 5  ,
        width: 200, height: 200, borderRadius: 100,
        borderWidth: 2,
        borderColor: "rgba(255,90,31,0.12)",
      }} />
      <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
        <LogoBadge/>
        <Text style={{fontFamily:fonts.headingHeavy,fontSize:30,padding:spacing.md,color:colors.text}}>IRONLOG</Text>
      </View>
      <View style={{flex:2,justifyContent:'flex-start',padding:spacing.sm}}>
        <Text style={{fontFamily:fonts.headingHeavy,color:colors.text,fontSize:45}}>LIFT.</Text>
        <Text style={{fontFamily:fonts.headingHeavy,color:colors.text,fontSize:45}}>TRACK.</Text>
        <Text style={{fontFamily:fonts.headingHeavy,color:colors.accent,fontSize:45}}>REPEAT.</Text>
      </View>
      <View style={{flex:4,justifyContent:'flex-start',alignItems:'center',gap:spacing.sm}}>
        <Text style={{fontFamily:fonts.bodyBold,color:colors.textDim,fontSize:12,alignSelf:'center',padding:spacing.sm}}>
          {isSignIn? "Welcome back! Please sign in to continue": "Create your account - it's free"}
        </Text>
        {!isSignIn &&
        <Card style={{ width: "80%",flexDirection:'row',alignItems:'center',gap:spacing.sm}}>
          <Ionicons name='person-outline' size={20} color={colors.textMuted} />      
          <TextInput 
            value={username}
            onChangeText={setUsername}
            placeholder='Username'
            placeholderTextColor={colors.textMuted}
            style={{ flex: 1, fontFamily: fonts.body, color: colors.text, paddingVertical: spacing.sm }}>
          </TextInput>
        </Card>}
        <Card style={{ width: "80%",flexDirection:'row',alignItems:'center',gap:spacing.sm}}>
          <Ionicons name="mail-outline" size={20} color={colors.textMuted} />      
          <TextInput
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            placeholder='Email'
            placeholderTextColor={colors.textMuted}
            style={{ flex: 1, fontFamily: fonts.body, color: colors.text, paddingVertical: spacing.sm }}>
          </TextInput>
        </Card>
        <View style={{ width: "80%",gap:spacing.sm}}>
          <Card style={{flexDirection:'row',alignItems:'center',gap:spacing.sm}}>
            <Ionicons name='lock-closed-outline' size={20} color={colors.textMuted} />      
            <TextInput
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder='Password'
              placeholderTextColor={colors.textMuted}
              style={{ flex: 1, fontFamily: fonts.body, color: colors.text, paddingVertical: spacing.sm }}>
            </TextInput>
          </Card>
          {isSignIn &&
          <Pressable style={{alignSelf:'flex-end'}} onPress={()=>onForgotPassword()}>
            <Text style={{fontFamily:fonts.bodyBold,fontSize:12,color:colors.accent}}>Forgot password?</Text>
          </Pressable>}
        </View>
        <Card onPress={isSignIn? onSignIn:onSignUp} style={{paddingVertical: spacing.md,backgroundColor:colors.accent, width: "80%",alignItems:'center'}}>
          <Text style={{fontFamily:fonts.headingHeavy,fontSize:spacing.lg,color:colors.background}}>
            {isSignIn? "SIGN IN":"SIGN UP"}
          </Text>
        </Card>
        <View style={{ width: "80%", height: 1, backgroundColor: colors.surfaceRaised }} />
        <View style={{width:"80%",flexDirection:'row',justifyContent:'center',gap:spacing.sm}}>
          <Text style={{fontFamily:fonts.bodyBold,fontSize:spacing.md,color:colors.textDim}}>
            {isSignIn?"New here?":"Already a member?"}
          </Text>
          <Pressable onPress={()=>setIsSignIn(!isSignIn)}>
            <Text style={{fontFamily:fonts.bodyBold,fontSize:spacing.md,color:colors.text}}>
              {isSignIn?"Create account":"Log in now"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  )   
}