import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SCREEN_W = Dimensions.get('window').width;
const SCREEN_H = Dimensions.get('window').height;

export interface ARFilterDef {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
}

export const AR_FILTERS: ARFilterDef[] = [
  { id: 'ar_none', name: 'Off', thumbnail: '🚫', category: 'All' },
  { id: 'ar_dog', name: 'Puppy', thumbnail: '🐶', category: 'Animals' },
  { id: 'ar_cat', name: 'Kitty', thumbnail: '🐱', category: 'Animals' },
  { id: 'ar_bunny', name: 'Bunny', thumbnail: '🐰', category: 'Animals' },
  { id: 'ar_tiger', name: 'Tiger', thumbnail: '🐯', category: 'Animals' },
  { id: 'ar_bear', name: 'Bear', thumbnail: '🐻', category: 'Animals' },
  { id: 'ar_unicorn', name: 'Unicorn', thumbnail: '🦄', category: 'Fantasy' },
  { id: 'ar_flowers', name: 'Bloom', thumbnail: '🌸', category: 'Face' },
  { id: 'ar_sakura', name: 'Sakura', thumbnail: '🌺', category: 'Face' },
  { id: 'ar_butterfly', name: 'Flutter', thumbnail: '🦋', category: 'Vibes' },
  { id: 'ar_angel', name: 'Angel', thumbnail: '😇', category: 'Fantasy' },
  { id: 'ar_devil', name: 'Devil', thumbnail: '😈', category: 'Fantasy' },
  { id: 'ar_crown', name: 'Queen', thumbnail: '👑', category: 'Face' },
  { id: 'ar_sunglasses', name: 'Sunnies', thumbnail: '🕶️', category: 'Face' },
  { id: 'ar_hearts', name: 'Love', thumbnail: '💖', category: 'Vibes' },
  { id: 'ar_stars', name: 'Star', thumbnail: '⭐', category: 'Vibes' },
  { id: 'ar_rainbow', name: 'Rainbow', thumbnail: '🌈', category: 'Vibes' },
  { id: 'ar_galaxy', name: 'Galaxy', thumbnail: '🌌', category: 'Fantasy' },
  { id: 'ar_disco', name: 'Disco', thumbnail: '🪩', category: 'Party' },
  { id: 'ar_confetti', name: 'Party', thumbnail: '🎉', category: 'Party' },
  { id: 'ar_money', name: 'Money', thumbnail: '💸', category: 'Party' },
  { id: 'ar_bubble', name: 'Bubbles', thumbnail: '🫧', category: 'Vibes' },
  { id: 'ar_snow', name: 'Frost', thumbnail: '❄️', category: 'Vibes' },
  { id: 'ar_alien', name: 'Alien', thumbnail: '👽', category: 'Fantasy' },
  { id: 'ar_fire', name: 'Fire', thumbnail: '🔥', category: 'Party' },
  { id: 'ar_neon', name: 'Neon', thumbnail: '💡', category: 'Vibes' },
];

function DogEars() {
  const earW = SCREEN_W * 0.16;
  const earH = earW * 1.35;
  return (
    <>
      <View style={[s.ear, { top: SCREEN_H * 0.03, left: SCREEN_W * 0.13, width: earW, height: earH, borderRadius: earW * 0.45, backgroundColor: '#6B3F1B', transform: [{ rotate: '-18deg' }] }]}>
        <View style={[s.earInner, { backgroundColor: '#C97B4B' }]} />
      </View>
      <View style={[s.ear, { top: SCREEN_H * 0.03, right: SCREEN_W * 0.13, width: earW, height: earH, borderRadius: earW * 0.45, backgroundColor: '#6B3F1B', transform: [{ rotate: '18deg' }] }]}>
        <View style={[s.earInner, { backgroundColor: '#C97B4B' }]} />
      </View>
      <View style={[s.nose, { top: SCREEN_H * 0.44, alignSelf: 'center', width: 34, height: 26, borderRadius: 13, backgroundColor: '#2C1A0E' }]} />
      <View style={[s.blush, { top: SCREEN_H * 0.41, left: SCREEN_W * 0.14, backgroundColor: 'rgba(255,150,100,0.35)' }]} />
      <View style={[s.blush, { top: SCREEN_H * 0.41, right: SCREEN_W * 0.14, backgroundColor: 'rgba(255,150,100,0.35)' }]} />
    </>
  );
}

function CatEars() {
  const earSize = SCREEN_W * 0.14;
  return (
    <>
      <View style={{ position: 'absolute', top: SCREEN_H * 0.04, left: SCREEN_W * 0.17 }}>
        <View style={[s.catEar, { borderBottomWidth: earSize, borderLeftWidth: earSize * 0.6, borderRightWidth: earSize * 0.6, borderBottomColor: '#2C1A0E' }]} />
        <View style={[s.catEarInner, { borderBottomWidth: earSize * 0.6, borderLeftWidth: earSize * 0.38, borderRightWidth: earSize * 0.38, borderBottomColor: '#E88FAA', bottom: 2 }]} />
      </View>
      <View style={{ position: 'absolute', top: SCREEN_H * 0.04, right: SCREEN_W * 0.17 }}>
        <View style={[s.catEar, { borderBottomWidth: earSize, borderLeftWidth: earSize * 0.6, borderRightWidth: earSize * 0.6, borderBottomColor: '#2C1A0E' }]} />
        <View style={[s.catEarInner, { borderBottomWidth: earSize * 0.6, borderLeftWidth: earSize * 0.38, borderRightWidth: earSize * 0.38, borderBottomColor: '#E88FAA', bottom: 2 }]} />
      </View>
      <View style={[s.nose, { top: SCREEN_H * 0.435, alignSelf: 'center', width: 20, height: 16, borderRadius: 8, backgroundColor: '#E88FAA' }]} />
      <View style={[s.whisker, { top: SCREEN_H * 0.44, left: 0, width: SCREEN_W * 0.32, transform: [{ rotate: '-8deg' }] }]} />
      <View style={[s.whisker, { top: SCREEN_H * 0.45, left: 0, width: SCREEN_W * 0.32, transform: [{ rotate: '4deg' }] }]} />
      <View style={[s.whisker, { top: SCREEN_H * 0.44, right: 0, width: SCREEN_W * 0.32, transform: [{ rotate: '8deg' }] }]} />
      <View style={[s.whisker, { top: SCREEN_H * 0.45, right: 0, width: SCREEN_W * 0.32, transform: [{ rotate: '-4deg' }] }]} />
      <View style={[s.blush, { top: SCREEN_H * 0.41, left: SCREEN_W * 0.12, backgroundColor: 'rgba(230,130,160,0.35)' }]} />
      <View style={[s.blush, { top: SCREEN_H * 0.41, right: SCREEN_W * 0.12, backgroundColor: 'rgba(230,130,160,0.35)' }]} />
    </>
  );
}

function BunnyEars() {
  const earW = SCREEN_W * 0.1;
  const earH = SCREEN_H * 0.22;
  return (
    <>
      <View style={[s.ear, { top: -SCREEN_H * 0.01, left: SCREEN_W * 0.29, width: earW, height: earH, borderRadius: earW * 0.5, backgroundColor: '#E8E8F0', transform: [{ rotate: '-10deg' }] }]}>
        <View style={[s.earInner, { backgroundColor: '#F2A5B8', borderRadius: earW * 0.4 }]} />
      </View>
      <View style={[s.ear, { top: -SCREEN_H * 0.01, right: SCREEN_W * 0.29, width: earW, height: earH, borderRadius: earW * 0.5, backgroundColor: '#E8E8F0', transform: [{ rotate: '10deg' }] }]}>
        <View style={[s.earInner, { backgroundColor: '#F2A5B8', borderRadius: earW * 0.4 }]} />
      </View>
      <View style={[s.nose, { top: SCREEN_H * 0.44, alignSelf: 'center', width: 22, height: 18, borderRadius: 10, backgroundColor: '#F2A5B8' }]} />
      <View style={[s.whisker, { top: SCREEN_H * 0.44, left: 0, width: SCREEN_W * 0.28, transform: [{ rotate: '-5deg' }] }]} />
      <View style={[s.whisker, { top: SCREEN_H * 0.45, left: 0, width: SCREEN_W * 0.28, transform: [{ rotate: '5deg' }] }]} />
      <View style={[s.whisker, { top: SCREEN_H * 0.44, right: 0, width: SCREEN_W * 0.28, transform: [{ rotate: '5deg' }] }]} />
      <View style={[s.whisker, { top: SCREEN_H * 0.45, right: 0, width: SCREEN_W * 0.28, transform: [{ rotate: '-5deg' }] }]} />
    </>
  );
}

function FlowerCrown() {
  const flowers = ['🌸', '🌺', '🌼', '🌸', '🌺', '🌼', '🌸'];
  return (
    <View style={{ position: 'absolute', top: SCREEN_H * 0.06, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' }}>
      {flowers.map((f, i) => (
        <Text key={i} style={{ fontSize: i === 3 ? 38 : 28, marginHorizontal: -2, transform: [{ rotate: `${(i - 3) * 8}deg` }] }}>{f}</Text>
      ))}
    </View>
  );
}

function AngelHalo() {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.08, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
    ])).start();
  }, []);
  return (
    <>
      <Animated.View style={{ position: 'absolute', top: SCREEN_H * 0.06, alignSelf: 'center', transform: [{ scaleX: pulse }] }}>
        <LinearGradient colors={['#FFE566', '#FFC107', '#FFE566']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={{ width: SCREEN_W * 0.42, height: 14, borderRadius: 7 }} />
      </Animated.View>
      <View style={[s.blush, { top: SCREEN_H * 0.41, left: SCREEN_W * 0.14, backgroundColor: 'rgba(255,220,180,0.4)' }]} />
      <View style={[s.blush, { top: SCREEN_H * 0.41, right: SCREEN_W * 0.14, backgroundColor: 'rgba(255,220,180,0.4)' }]} />
    </>
  );
}

function DevilHorns() {
  const hornSize = SCREEN_W * 0.11;
  return (
    <>
      <View style={{ position: 'absolute', top: SCREEN_H * 0.03, left: SCREEN_W * 0.2 }}>
        <View style={[s.horn, { borderBottomWidth: hornSize * 1.4, borderLeftWidth: hornSize * 0.5, borderRightWidth: hornSize * 0.5, borderBottomColor: '#CC1111' }]} />
      </View>
      <View style={{ position: 'absolute', top: SCREEN_H * 0.03, right: SCREEN_W * 0.2 }}>
        <View style={[s.horn, { borderBottomWidth: hornSize * 1.4, borderLeftWidth: hornSize * 0.5, borderRightWidth: hornSize * 0.5, borderBottomColor: '#CC1111' }]} />
      </View>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(180,0,0,0.08)' }]} />
    </>
  );
}

function PrincessCrown() {
  const sparkle = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.timing(sparkle, { toValue: 1, duration: 2000, useNativeDriver: true })).start();
  }, []);
  const rotate = sparkle.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const sparklePos = [
    { top: SCREEN_H * 0.08, left: SCREEN_W * 0.1 },
    { top: SCREEN_H * 0.12, right: SCREEN_W * 0.08 },
    { top: SCREEN_H * 0.2, left: SCREEN_W * 0.06 },
    { top: SCREEN_H * 0.15, right: SCREEN_W * 0.15 },
  ];
  return (
    <>
      <View style={{ position: 'absolute', top: SCREEN_H * 0.03, alignSelf: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 64 }}>👑</Text>
      </View>
      {sparklePos.map((pos, i) => (
        <Animated.Text key={i} style={{ position: 'absolute', ...pos, fontSize: 14 + (i % 3) * 4, transform: [{ rotate }] }}>✨</Animated.Text>
      ))}
    </>
  );
}

function FloatingParticle({ emoji, startX, delay, size }: { emoji: string; startX: number; delay: number; size: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = () => {
      anim.setValue(0);
      Animated.timing(anim, { toValue: 1, duration: 2000 + delay, delay, useNativeDriver: true, easing: Easing.out(Easing.quad) }).start(loop);
    };
    loop();
  }, []);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_H * 0.9, SCREEN_H * 0.05] });
  const opacity = anim.interpolate({ inputRange: [0, 0.1, 0.85, 1], outputRange: [0, 1, 1, 0] });
  return <Animated.Text style={{ position: 'absolute', left: startX, fontSize: size, opacity, transform: [{ translateY }] }}>{emoji}</Animated.Text>;
}

function HeartEyes() {
  const heartPositions = [
    { x: SCREEN_W * 0.06, delay: 0, size: 16 },
    { x: SCREEN_W * 0.18, delay: 250, size: 22 },
    { x: SCREEN_W * 0.34, delay: 450, size: 14 },
    { x: SCREEN_W * 0.5, delay: 100, size: 20 },
    { x: SCREEN_W * 0.64, delay: 350, size: 18 },
    { x: SCREEN_W * 0.76, delay: 200, size: 14 },
    { x: SCREEN_W * 0.86, delay: 550, size: 22 },
    { x: SCREEN_W * 0.92, delay: 400, size: 16 },
  ];
  return (
    <>
      <Text style={{ position: 'absolute', top: SCREEN_H * 0.31, left: SCREEN_W * 0.24, fontSize: 34 }}>💖</Text>
      <Text style={{ position: 'absolute', top: SCREEN_H * 0.31, right: SCREEN_W * 0.24, fontSize: 34 }}>💖</Text>
      {heartPositions.map((p, i) => (
        <FloatingParticle key={i} emoji={i % 2 === 0 ? '💕' : '💖'} startX={p.x} delay={p.delay} size={p.size} />
      ))}
      <View style={[s.blush, { top: SCREEN_H * 0.41, left: SCREEN_W * 0.12, backgroundColor: 'rgba(255,100,150,0.4)', width: 54, height: 22 }]} />
      <View style={[s.blush, { top: SCREEN_H * 0.41, right: SCREEN_W * 0.12, backgroundColor: 'rgba(255,100,150,0.4)', width: 54, height: 22 }]} />
    </>
  );
}

function SparkleParticle({ emoji, pos, delay, size }: { emoji: string; pos: { left?: number; top: number }; delay: number; size: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = () => {
      anim.setValue(0);
      Animated.timing(anim, { toValue: 1, duration: 1600 + delay, delay, useNativeDriver: true }).start(loop);
    };
    loop();
  }, []);
  const opacity = anim.interpolate({ inputRange: [0, 0.3, 0.7, 1], outputRange: [0, 1, 1, 0] });
  const scale = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 1, 0.5] });
  return <Animated.Text style={{ position: 'absolute', ...pos, fontSize: size, opacity, transform: [{ scale }] }}>{emoji}</Animated.Text>;
}

function StarDust() {
  const particles = [
    { pos: { left: SCREEN_W * 0.05, top: SCREEN_H * 0.08 }, delay: 0, size: 18, emoji: '✨' },
    { pos: { left: SCREEN_W * 0.85, top: SCREEN_H * 0.12 }, delay: 200, size: 24, emoji: '⭐' },
    { pos: { left: SCREEN_W * 0.2, top: SCREEN_H * 0.2 }, delay: 400, size: 16, emoji: '💫' },
    { pos: { left: SCREEN_W * 0.72, top: SCREEN_H * 0.25 }, delay: 100, size: 22, emoji: '🌟' },
    { pos: { left: SCREEN_W * 0.1, top: SCREEN_H * 0.35 }, delay: 500, size: 18, emoji: '✨' },
    { pos: { left: SCREEN_W * 0.88, top: SCREEN_H * 0.38 }, delay: 300, size: 16, emoji: '⭐' },
    { pos: { left: SCREEN_W * 0.3, top: SCREEN_H * 0.5 }, delay: 600, size: 22, emoji: '💫' },
    { pos: { left: SCREEN_W * 0.65, top: SCREEN_H * 0.48 }, delay: 150, size: 18, emoji: '🌟' },
    { pos: { left: SCREEN_W * 0.15, top: SCREEN_H * 0.62 }, delay: 450, size: 24, emoji: '✨' },
    { pos: { left: SCREEN_W * 0.8, top: SCREEN_H * 0.6 }, delay: 250, size: 16, emoji: '⭐' },
    { pos: { left: SCREEN_W * 0.45, top: SCREEN_H * 0.12 }, delay: 350, size: 20, emoji: '💫' },
    { pos: { left: SCREEN_W * 0.55, top: SCREEN_H * 0.7 }, delay: 550, size: 18, emoji: '🌟' },
  ];
  return (
    <>
      {particles.map((p, i) => (
        <SparkleParticle key={i} emoji={p.emoji} pos={p.pos} delay={p.delay} size={p.size} />
      ))}
    </>
  );
}

function RainbowFilter() {
  const pulse = useRef(new Animated.Value(0.85)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0.85, duration: 1200, useNativeDriver: true }),
    ])).start();
  }, []);
  return (
    <>
      <Animated.View style={{ position: 'absolute', top: SCREEN_H * 0.01, alignSelf: 'center', transform: [{ scale: pulse }] }}>
        <Text style={{ fontSize: 80 }}>🌈</Text>
      </Animated.View>
      {[
        { left: SCREEN_W * 0.05, top: SCREEN_H * 0.15 },
        { left: SCREEN_W * 0.82, top: SCREEN_H * 0.18 },
        { left: SCREEN_W * 0.2, top: SCREEN_H * 0.32 },
        { left: SCREEN_W * 0.75, top: SCREEN_H * 0.3 },
      ].map((pos, i) => (
        <Text key={i} style={{ position: 'absolute', ...pos, fontSize: 20 + (i % 2) * 8 }}>✨</Text>
      ))}
    </>
  );
}

function SnowflakeParticle({ startX, delay, emoji }: { startX: number; delay: number; emoji: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = () => {
      anim.setValue(0);
      Animated.parallel([
        Animated.timing(anim, { toValue: 1, duration: 2800 + delay, delay, useNativeDriver: true }),
        Animated.loop(Animated.sequence([
          Animated.timing(sway, { toValue: 1, duration: 1200, useNativeDriver: true }),
          Animated.timing(sway, { toValue: -1, duration: 1200, useNativeDriver: true }),
        ])),
      ]).start(loop);
    };
    loop();
  }, []);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-20, SCREEN_H] });
  const translateX = sway.interpolate({ inputRange: [-1, 1], outputRange: [-18, 18] });
  const opacity = anim.interpolate({ inputRange: [0, 0.05, 0.9, 1], outputRange: [0, 1, 1, 0] });
  return (
    <Animated.Text style={{ position: 'absolute', left: startX, top: 0, fontSize: 14, opacity, transform: [{ translateY }, { translateX }] }}>
      {emoji}
    </Animated.Text>
  );
}

function SnowFilter() {
  const flakes = [
    { x: SCREEN_W * 0.04, delay: 0, emoji: '❄️' },
    { x: SCREEN_W * 0.12, delay: 300, emoji: '🌨' },
    { x: SCREEN_W * 0.22, delay: 600, emoji: '❄️' },
    { x: SCREEN_W * 0.32, delay: 150, emoji: '⛄' },
    { x: SCREEN_W * 0.44, delay: 450, emoji: '❄️' },
    { x: SCREEN_W * 0.55, delay: 250, emoji: '🌨' },
    { x: SCREEN_W * 0.64, delay: 700, emoji: '❄️' },
    { x: SCREEN_W * 0.74, delay: 100, emoji: '⛄' },
    { x: SCREEN_W * 0.82, delay: 550, emoji: '❄️' },
    { x: SCREEN_W * 0.9, delay: 350, emoji: '🌨' },
  ];
  return (
    <>
      <View style={{ position: 'absolute', top: SCREEN_H * 0.03, alignSelf: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 52 }}>❄️</Text>
        <LinearGradient colors={['#A8D8EA', '#C9E8F5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={{ width: SCREEN_W * 0.5, height: 6, borderRadius: 3, marginTop: 2 }} />
      </View>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(168,216,234,0.08)' }]} />
      {flakes.map((f, i) => (
        <SnowflakeParticle key={i} startX={f.x} delay={f.delay} emoji={f.emoji} />
      ))}
    </>
  );
}

function AlienFilter() {
  return (
    <>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,200,80,0.12)' }]} />
      <View style={{ position: 'absolute', top: SCREEN_H * 0.04, alignSelf: 'center' }}>
        <Text style={{ fontSize: 70 }}>👽</Text>
      </View>
      <View style={[s.blush, { top: SCREEN_H * 0.41, left: SCREEN_W * 0.12, backgroundColor: 'rgba(0,255,100,0.3)', width: 50, height: 22 }]} />
      <View style={[s.blush, { top: SCREEN_H * 0.41, right: SCREEN_W * 0.12, backgroundColor: 'rgba(0,255,100,0.3)', width: 50, height: 22 }]} />
    </>
  );
}

function FireParticle({ left, delay }: { left: number; delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = () => {
      anim.setValue(0);
      Animated.timing(anim, { toValue: 1, duration: 1000 + delay, delay, useNativeDriver: true, easing: Easing.out(Easing.quad) }).start(loop);
    };
    loop();
  }, []);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_H * 0.14, SCREEN_H * 0.01] });
  const opacity = anim.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 1, 1, 0] });
  const scale = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.6, 1.2, 0.4] });
  return (
    <Animated.Text style={{ position: 'absolute', left, top: 0, fontSize: 22, opacity, transform: [{ translateY }, { scale }] }}>🔥</Animated.Text>
  );
}

function FireFilter() {
  const firePos = [
    { left: SCREEN_W * 0.22, delay: 0 },
    { left: SCREEN_W * 0.3, delay: 120 },
    { left: SCREEN_W * 0.38, delay: 250 },
    { left: SCREEN_W * 0.46, delay: 50 },
    { left: SCREEN_W * 0.54, delay: 180 },
    { left: SCREEN_W * 0.62, delay: 300 },
    { left: SCREEN_W * 0.7, delay: 90 },
    { left: SCREEN_W * 0.78, delay: 200 },
  ];
  return (
    <>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(200,50,0,0.1)' }]} />
      {firePos.map((p, i) => (
        <FireParticle key={i} left={p.left} delay={p.delay} />
      ))}
      <View style={{ position: 'absolute', top: SCREEN_H * 0.04, alignSelf: 'center' }}>
        <Text style={{ fontSize: 56 }}>🔥</Text>
      </View>
    </>
  );
}

function TigerEars() {
  const earW = SCREEN_W * 0.15;
  const earH = earW * 1.2;
  return (
    <>
      <View style={[s.ear, { top: SCREEN_H * 0.03, left: SCREEN_W * 0.14, width: earW, height: earH, borderRadius: earW * 0.4, backgroundColor: '#E07820', transform: [{ rotate: '-14deg' }] }]}>
        <View style={[s.earInner, { backgroundColor: '#F5C06A' }]} />
      </View>
      <View style={[s.ear, { top: SCREEN_H * 0.03, right: SCREEN_W * 0.14, width: earW, height: earH, borderRadius: earW * 0.4, backgroundColor: '#E07820', transform: [{ rotate: '14deg' }] }]}>
        <View style={[s.earInner, { backgroundColor: '#F5C06A' }]} />
      </View>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(224,120,32,0.07)' }]} />
      {[
        { top: SCREEN_H * 0.34, left: SCREEN_W * 0.1, w: 32, r: '-30deg' },
        { top: SCREEN_H * 0.38, left: SCREEN_W * 0.06, w: 26, r: '-20deg' },
        { top: SCREEN_H * 0.42, left: SCREEN_W * 0.08, w: 28, r: '-25deg' },
        { top: SCREEN_H * 0.34, right: SCREEN_W * 0.1, w: 32, r: '30deg' },
        { top: SCREEN_H * 0.38, right: SCREEN_W * 0.06, w: 26, r: '20deg' },
        { top: SCREEN_H * 0.42, right: SCREEN_W * 0.08, w: 28, r: '25deg' },
      ].map((stripe, i) => (
        <View key={i} style={{ position: 'absolute', top: stripe.top, left: (stripe as any).left, right: (stripe as any).right, width: stripe.w, height: 5, borderRadius: 3, backgroundColor: 'rgba(120,50,0,0.55)', transform: [{ rotate: stripe.r }] }} />
      ))}
      <View style={[s.nose, { top: SCREEN_H * 0.44, alignSelf: 'center', width: 28, height: 22, borderRadius: 10, backgroundColor: '#C04A20' }]} />
      <View style={[s.blush, { top: SCREEN_H * 0.42, left: SCREEN_W * 0.14, backgroundColor: 'rgba(220,120,40,0.3)' }]} />
      <View style={[s.blush, { top: SCREEN_H * 0.42, right: SCREEN_W * 0.14, backgroundColor: 'rgba(220,120,40,0.3)' }]} />
    </>
  );
}

function BearEars() {
  const earR = SCREEN_W * 0.1;
  return (
    <>
      <View style={{ position: 'absolute', top: SCREEN_H * 0.05, left: SCREEN_W * 0.15, width: earR * 2, height: earR * 2, borderRadius: earR, backgroundColor: '#6B4226' }}>
        <View style={{ position: 'absolute', top: '18%', left: '18%', right: '18%', bottom: '18%', borderRadius: 100, backgroundColor: '#C97B5A' }} />
      </View>
      <View style={{ position: 'absolute', top: SCREEN_H * 0.05, right: SCREEN_W * 0.15, width: earR * 2, height: earR * 2, borderRadius: earR, backgroundColor: '#6B4226' }}>
        <View style={{ position: 'absolute', top: '18%', left: '18%', right: '18%', bottom: '18%', borderRadius: 100, backgroundColor: '#C97B5A' }} />
      </View>
      <View style={[s.nose, { top: SCREEN_H * 0.445, alignSelf: 'center', width: 36, height: 28, borderRadius: 14, backgroundColor: '#3A1A0A' }]} />
      <View style={[s.blush, { top: SCREEN_H * 0.43, left: SCREEN_W * 0.13, backgroundColor: 'rgba(180,100,60,0.35)', width: 52, height: 22 }]} />
      <View style={[s.blush, { top: SCREEN_H * 0.43, right: SCREEN_W * 0.13, backgroundColor: 'rgba(180,100,60,0.35)', width: 52, height: 22 }]} />
    </>
  );
}

function UnicornFilter() {
  const sparkle = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.timing(sparkle, { toValue: 1, duration: 3000, useNativeDriver: true })).start();
  }, []);
  const rotate = sparkle.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const rainbowColors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#C77DFF'];
  const sparklePos = [
    { left: SCREEN_W * 0.06, top: SCREEN_H * 0.12 },
    { left: SCREEN_W * 0.82, top: SCREEN_H * 0.1 },
    { left: SCREEN_W * 0.15, top: SCREEN_H * 0.28 },
    { left: SCREEN_W * 0.78, top: SCREEN_H * 0.3 },
    { left: SCREEN_W * 0.04, top: SCREEN_H * 0.42 },
    { left: SCREEN_W * 0.88, top: SCREEN_H * 0.44 },
  ];
  return (
    <>
      <View style={{ position: 'absolute', top: SCREEN_H * 0.01, alignSelf: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, transform: [{ rotate: '30deg' }] }}>🦄</Text>
        <View style={{ flexDirection: 'row', marginTop: 2 }}>
          {rainbowColors.map((c, i) => (
            <View key={i} style={{ width: 12, height: 50, backgroundColor: c, opacity: 0.7 }} />
          ))}
        </View>
      </View>
      {sparklePos.map((pos, i) => (
        <Animated.Text key={i} style={{ position: 'absolute', ...pos, fontSize: 16 + (i % 3) * 6, transform: [{ rotate }] }}>{'✨🌟💫🦋🌈⭐'[i]}</Animated.Text>
      ))}
      <View style={[s.blush, { top: SCREEN_H * 0.41, left: SCREEN_W * 0.12, backgroundColor: 'rgba(199,125,255,0.4)', width: 54, height: 22 }]} />
      <View style={[s.blush, { top: SCREEN_H * 0.41, right: SCREEN_W * 0.12, backgroundColor: 'rgba(199,125,255,0.4)', width: 54, height: 22 }]} />
    </>
  );
}

function SakuraPetal({ startX, delay }: { startX: number; delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = () => {
      anim.setValue(0); sway.setValue(0); spin.setValue(0);
      Animated.parallel([
        Animated.timing(anim, { toValue: 1, duration: 3200 + delay, delay, useNativeDriver: true }),
        Animated.loop(Animated.sequence([
          Animated.timing(sway, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(sway, { toValue: -1, duration: 1000, useNativeDriver: true }),
        ])),
        Animated.loop(Animated.timing(spin, { toValue: 1, duration: 2000, useNativeDriver: true })),
      ]).start(loop);
    };
    loop();
  }, []);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-20, SCREEN_H + 20] });
  const translateX = sway.interpolate({ inputRange: [-1, 1], outputRange: [-22, 22] });
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const opacity = anim.interpolate({ inputRange: [0, 0.05, 0.9, 1], outputRange: [0, 1, 1, 0] });
  return (
    <Animated.Text style={{ position: 'absolute', left: startX, top: 0, fontSize: 16, opacity, transform: [{ translateY }, { translateX }, { rotate }] }}>🌸</Animated.Text>
  );
}

function SakuraFilter() {
  const petals = [
    { x: SCREEN_W * 0.05, delay: 0 }, { x: SCREEN_W * 0.15, delay: 400 },
    { x: SCREEN_W * 0.28, delay: 800 }, { x: SCREEN_W * 0.4, delay: 200 },
    { x: SCREEN_W * 0.52, delay: 600 }, { x: SCREEN_W * 0.64, delay: 100 },
    { x: SCREEN_W * 0.75, delay: 500 }, { x: SCREEN_W * 0.85, delay: 300 },
    { x: SCREEN_W * 0.92, delay: 700 }, { x: SCREEN_W * 0.2, delay: 900 },
    { x: SCREEN_W * 0.48, delay: 1100 }, { x: SCREEN_W * 0.7, delay: 1000 },
  ];
  return (
    <>
      <View style={{ position: 'absolute', top: SCREEN_H * 0.04, alignSelf: 'center' }}>
        <Text style={{ fontSize: 18 }}>🌸🌸🌸🌸🌸🌸🌸</Text>
      </View>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,182,193,0.07)' }]} />
      {petals.map((p, i) => <SakuraPetal key={i} startX={p.x} delay={p.delay} />)}
    </>
  );
}

function ButterflyFloat({ startX, startY, delay, flip }: { startX: number; startY: number; delay: number; flip: boolean }) {
  const anim = useRef(new Animated.Value(0)).current;
  const wingFlap = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(wingFlap, { toValue: 0.3, duration: 200, useNativeDriver: true }),
      Animated.timing(wingFlap, { toValue: 1, duration: 200, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 3000 + delay, delay, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 3000, useNativeDriver: true }),
    ])).start();
  }, []);
  const translateX = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [startX, startX + (flip ? 60 : -60), startX] });
  const translateY = anim.interpolate({ inputRange: [0, 0.25, 0.75, 1], outputRange: [startY, startY - 40, startY + 20, startY] });
  return (
    <Animated.Text style={{ position: 'absolute', fontSize: 26, transform: [{ translateX }, { translateY }, { scaleX: wingFlap }] }}>🦋</Animated.Text>
  );
}

function ButterflyFilter() {
  const butterflies = [
    { x: SCREEN_W * 0.05, y: SCREEN_H * 0.15, delay: 0, flip: false },
    { x: SCREEN_W * 0.72, y: SCREEN_H * 0.12, delay: 500, flip: true },
    { x: SCREEN_W * 0.1, y: SCREEN_H * 0.5, delay: 1000, flip: false },
    { x: SCREEN_W * 0.75, y: SCREEN_H * 0.45, delay: 300, flip: true },
    { x: SCREEN_W * 0.35, y: SCREEN_H * 0.08, delay: 800, flip: false },
    { x: SCREEN_W * 0.55, y: SCREEN_H * 0.65, delay: 200, flip: true },
  ];
  return (
    <>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,200,255,0.06)' }]} />
      {butterflies.map((b, i) => <ButterflyFloat key={i} startX={b.x} startY={b.y} delay={b.delay} flip={b.flip} />)}
    </>
  );
}

function SunglassesFilter() {
  const shine = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(shine, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.timing(shine, { toValue: 0, duration: 1500, useNativeDriver: true }),
    ])).start();
  }, []);
  const shineOpacity = shine.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.9] });
  return (
    <>
      <View style={{ position: 'absolute', top: SCREEN_H * 0.32, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: SCREEN_W * 0.34, height: SCREEN_W * 0.18, borderRadius: 14, backgroundColor: '#111', borderWidth: 4, borderColor: '#888', overflow: 'hidden' }}>
          <Animated.View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,180,255,0.25)', opacity: shineOpacity }} />
          <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0)']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', borderRadius: 10 }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
        </View>
        <View style={{ width: SCREEN_W * 0.06, height: 5, backgroundColor: '#888' }} />
        <View style={{ width: SCREEN_W * 0.34, height: SCREEN_W * 0.18, borderRadius: 14, backgroundColor: '#111', borderWidth: 4, borderColor: '#888', overflow: 'hidden' }}>
          <Animated.View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,180,255,0.25)', opacity: shineOpacity }} />
          <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0)']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', borderRadius: 10 }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
        </View>
      </View>
      {[
        { top: SCREEN_H * 0.28, left: SCREEN_W * 0.06 },
        { top: SCREEN_H * 0.3, right: SCREEN_W * 0.06 },
      ].map((pos, i) => (
        <Text key={i} style={{ position: 'absolute', ...pos, fontSize: 18 }}>✨</Text>
      ))}
    </>
  );
}

function GalaxyFilter() {
  const twinkle = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(twinkle, { toValue: 1, duration: 2000, useNativeDriver: true }),
      Animated.timing(twinkle, { toValue: 0, duration: 2000, useNativeDriver: true }),
    ])).start();
  }, []);
  const stars = [
    { left: SCREEN_W * 0.04, top: SCREEN_H * 0.06, size: 6 }, { left: SCREEN_W * 0.88, top: SCREEN_H * 0.09, size: 8 },
    { left: SCREEN_W * 0.22, top: SCREEN_H * 0.14, size: 5 }, { left: SCREEN_W * 0.68, top: SCREEN_H * 0.18, size: 7 },
    { left: SCREEN_W * 0.1, top: SCREEN_H * 0.3, size: 6 }, { left: SCREEN_W * 0.82, top: SCREEN_H * 0.32, size: 5 },
    { left: SCREEN_W * 0.38, top: SCREEN_H * 0.22, size: 8 }, { left: SCREEN_W * 0.55, top: SCREEN_H * 0.08, size: 6 },
    { left: SCREEN_W * 0.18, top: SCREEN_H * 0.48, size: 5 }, { left: SCREEN_W * 0.76, top: SCREEN_H * 0.5, size: 7 },
    { left: SCREEN_W * 0.46, top: SCREEN_H * 0.6, size: 6 }, { left: SCREEN_W * 0.92, top: SCREEN_H * 0.55, size: 5 },
  ];
  return (
    <>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(50,0,120,0.22)' }]} />
      {stars.map((star, i) => (
        <Animated.View key={i} style={{
          position: 'absolute', left: star.left, top: star.top,
          width: star.size, height: star.size, borderRadius: star.size,
          backgroundColor: i % 3 === 0 ? '#C77DFF' : i % 3 === 1 ? '#4D96FF' : '#fff',
          opacity: twinkle.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3 + (i % 5) * 0.1, 1, 0.4 + (i % 4) * 0.1] }),
        }} />
      ))}
      <Text style={{ position: 'absolute', top: SCREEN_H * 0.03, alignSelf: 'center', fontSize: 44 }}>🌌</Text>
    </>
  );
}

function ConfettiPiece({ left, delay, color, shape }: { left: number; delay: number; color: string; shape: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = () => {
      anim.setValue(0); spin.setValue(0);
      Animated.parallel([
        Animated.timing(anim, { toValue: 1, duration: 2500 + delay, delay, useNativeDriver: true }),
        Animated.loop(Animated.timing(spin, { toValue: 1, duration: 800, useNativeDriver: true })),
      ]).start(loop);
    };
    loop();
  }, []);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-10, SCREEN_H + 10] });
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const opacity = anim.interpolate({ inputRange: [0, 0.05, 0.9, 1], outputRange: [0, 1, 1, 0] });
  return (
    <Animated.Text style={{ position: 'absolute', left, top: 0, fontSize: 14, color, opacity, transform: [{ translateY }, { rotate }] }}>{shape}</Animated.Text>
  );
}

function ConfettiFilter() {
  const pieces = [
    { left: SCREEN_W * 0.05, delay: 0, color: '#FF6B6B', shape: '●' },
    { left: SCREEN_W * 0.14, delay: 300, color: '#FFD93D', shape: '■' },
    { left: SCREEN_W * 0.24, delay: 600, color: '#6BCB77', shape: '★' },
    { left: SCREEN_W * 0.33, delay: 150, color: '#4D96FF', shape: '●' },
    { left: SCREEN_W * 0.43, delay: 450, color: '#C77DFF', shape: '■' },
    { left: SCREEN_W * 0.52, delay: 250, color: '#FF6B6B', shape: '★' },
    { left: SCREEN_W * 0.62, delay: 700, color: '#FFD93D', shape: '●' },
    { left: SCREEN_W * 0.72, delay: 100, color: '#6BCB77', shape: '■' },
    { left: SCREEN_W * 0.82, delay: 550, color: '#4D96FF', shape: '★' },
    { left: SCREEN_W * 0.9, delay: 350, color: '#C77DFF', shape: '●' },
    { left: SCREEN_W * 0.18, delay: 900, color: '#FF6B6B', shape: '■' },
    { left: SCREEN_W * 0.57, delay: 1100, color: '#FFD93D', shape: '★' },
  ];
  return (
    <>
      <View style={{ position: 'absolute', top: SCREEN_H * 0.03, alignSelf: 'center' }}>
        <Text style={{ fontSize: 44 }}>🎉</Text>
      </View>
      {pieces.map((p, i) => <ConfettiPiece key={i} left={p.left} delay={p.delay} color={p.color} shape={p.shape} />)}
    </>
  );
}

function MoneyPiece({ left, delay }: { left: number; delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = () => {
      anim.setValue(0); spin.setValue(0);
      Animated.parallel([
        Animated.timing(anim, { toValue: 1, duration: 2200 + delay, delay, useNativeDriver: true }),
        Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1200, useNativeDriver: true })),
      ]).start(loop);
    };
    loop();
  }, []);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-10, SCREEN_H + 10] });
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['-20deg', '20deg'] });
  const opacity = anim.interpolate({ inputRange: [0, 0.08, 0.9, 1], outputRange: [0, 1, 1, 0] });
  return (
    <Animated.Text style={{ position: 'absolute', left, top: 0, fontSize: 18, opacity, transform: [{ translateY }, { rotate }] }}>💸</Animated.Text>
  );
}

function MoneyFilter() {
  const bills = [
    { left: SCREEN_W * 0.04, delay: 0 }, { left: SCREEN_W * 0.15, delay: 400 },
    { left: SCREEN_W * 0.27, delay: 700 }, { left: SCREEN_W * 0.4, delay: 200 },
    { left: SCREEN_W * 0.52, delay: 550 }, { left: SCREEN_W * 0.63, delay: 100 },
    { left: SCREEN_W * 0.74, delay: 800 }, { left: SCREEN_W * 0.85, delay: 350 },
    { left: SCREEN_W * 0.92, delay: 600 }, { left: SCREEN_W * 0.2, delay: 900 },
  ];
  return (
    <>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,180,0,0.07)' }]} />
      <View style={{ position: 'absolute', top: SCREEN_H * 0.04, alignSelf: 'center' }}>
        <Text style={{ fontSize: 50 }}>💰</Text>
      </View>
      {bills.map((b, i) => <MoneyPiece key={i} left={b.left} delay={b.delay} />)}
    </>
  );
}

function BubbleFloat({ left, delay, size }: { left: number; delay: number; size: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = () => {
      anim.setValue(0); sway.setValue(0);
      Animated.parallel([
        Animated.timing(anim, { toValue: 1, duration: 3500 + delay, delay, useNativeDriver: true }),
        Animated.loop(Animated.sequence([
          Animated.timing(sway, { toValue: 1, duration: 900, useNativeDriver: true }),
          Animated.timing(sway, { toValue: -1, duration: 900, useNativeDriver: true }),
        ])),
      ]).start(loop);
    };
    loop();
  }, []);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_H + 20, -20] });
  const translateX = sway.interpolate({ inputRange: [-1, 1], outputRange: [-14, 14] });
  const opacity = anim.interpolate({ inputRange: [0, 0.05, 0.85, 1], outputRange: [0, 0.8, 0.7, 0] });
  return (
    <Animated.View style={{ position: 'absolute', left, bottom: 0, width: size, height: size, borderRadius: size, borderWidth: 2, borderColor: 'rgba(150,220,255,0.8)', backgroundColor: 'rgba(150,220,255,0.1)', opacity, transform: [{ translateY }, { translateX }] }}>
      <View style={{ position: 'absolute', top: '15%', left: '20%', width: '25%', height: '20%', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.5)' }} />
    </Animated.View>
  );
}

function BubbleFilter() {
  const bubbles = [
    { left: SCREEN_W * 0.05, delay: 0, size: 36 }, { left: SCREEN_W * 0.18, delay: 600, size: 52 },
    { left: SCREEN_W * 0.32, delay: 300, size: 28 }, { left: SCREEN_W * 0.46, delay: 900, size: 44 },
    { left: SCREEN_W * 0.6, delay: 150, size: 38 }, { left: SCREEN_W * 0.74, delay: 700, size: 30 },
    { left: SCREEN_W * 0.86, delay: 450, size: 48 }, { left: SCREEN_W * 0.12, delay: 1100, size: 24 },
    { left: SCREEN_W * 0.68, delay: 1300, size: 40 }, { left: SCREEN_W * 0.9, delay: 1000, size: 32 },
  ];
  return (
    <>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(150,220,255,0.06)' }]} />
      {bubbles.map((b, i) => <BubbleFloat key={i} left={b.left} delay={b.delay} size={b.size} />)}
    </>
  );
}

function NeonFilter() {
  const glow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 800, useNativeDriver: false }),
      Animated.timing(glow, { toValue: 0.5, duration: 400, useNativeDriver: false }),
      Animated.timing(glow, { toValue: 1, duration: 600, useNativeDriver: false }),
      Animated.timing(glow, { toValue: 0, duration: 1000, useNativeDriver: false }),
    ])).start();
  }, []);
  const borderColor = glow.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['rgba(0,255,255,0.4)', 'rgba(255,0,255,0.7)', 'rgba(0,255,255,0.9)'] });
  return (
    <>
      <Animated.View style={{ position: 'absolute', top: SCREEN_H * 0.18, left: SCREEN_W * 0.08, right: SCREEN_W * 0.08, bottom: SCREEN_H * 0.35, borderRadius: 140, borderWidth: 3, borderColor }} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,255,255,0.04)' }]} />
      {[
        { top: SCREEN_H * 0.12, left: SCREEN_W * 0.08, text: '✦' },
        { top: SCREEN_H * 0.12, right: SCREEN_W * 0.08, text: '✦' },
        { top: SCREEN_H * 0.05, left: SCREEN_W * 0.3, text: '◆' },
        { top: SCREEN_H * 0.05, right: SCREEN_W * 0.3, text: '◆' },
      ].map((el, i) => (
        <Text key={i} style={{ position: 'absolute', ...el, fontSize: 22, color: i % 2 === 0 ? '#00FFFF' : '#FF00FF' }}>{el.text}</Text>
      ))}
    </>
  );
}

function DiscoFilter() {
  const spin = useRef(new Animated.Value(0)).current;
  const light1 = useRef(new Animated.Value(0)).current;
  const light2 = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 4000, useNativeDriver: true })).start();
    Animated.loop(Animated.sequence([
      Animated.timing(light1, { toValue: 1, duration: 500, useNativeDriver: false }),
      Animated.timing(light1, { toValue: 0, duration: 500, useNativeDriver: false }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(light2, { toValue: 0, duration: 500, useNativeDriver: false }),
      Animated.timing(light2, { toValue: 1, duration: 500, useNativeDriver: false }),
    ])).start();
  }, []);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const beamColor1 = light1.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,50,200,0)', 'rgba(255,50,200,0.35)'] });
  const beamColor2 = light2.interpolate({ inputRange: [0, 1], outputRange: ['rgba(50,200,255,0)', 'rgba(50,200,255,0.35)'] });
  return (
    <>
      <Animated.View style={{ position: 'absolute', top: SCREEN_H * 0.02, alignSelf: 'center', transform: [{ rotate }] }}>
        <Text style={{ fontSize: 52 }}>🪩</Text>
      </Animated.View>
      <Animated.View style={{ position: 'absolute', top: SCREEN_H * 0.1, left: 0, right: 0, bottom: 0, backgroundColor: beamColor1 }} />
      <Animated.View style={{ position: 'absolute', top: SCREEN_H * 0.1, left: 0, right: 0, bottom: 0, backgroundColor: beamColor2 }} />
      <View style={[s.blush, { top: SCREEN_H * 0.41, left: SCREEN_W * 0.12, backgroundColor: 'rgba(255,50,200,0.3)', width: 52, height: 22 }]} />
      <View style={[s.blush, { top: SCREEN_H * 0.41, right: SCREEN_W * 0.12, backgroundColor: 'rgba(50,200,255,0.3)', width: 52, height: 22 }]} />
    </>
  );
}

interface ARFilterOverlayProps {
  filterId: string;
}

export default function ARFilterOverlay({ filterId }: ARFilterOverlayProps) {
  if (filterId === 'ar_none') return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {filterId === 'ar_dog' && <DogEars />}
      {filterId === 'ar_cat' && <CatEars />}
      {filterId === 'ar_bunny' && <BunnyEars />}
      {filterId === 'ar_tiger' && <TigerEars />}
      {filterId === 'ar_bear' && <BearEars />}
      {filterId === 'ar_unicorn' && <UnicornFilter />}
      {filterId === 'ar_flowers' && <FlowerCrown />}
      {filterId === 'ar_sakura' && <SakuraFilter />}
      {filterId === 'ar_butterfly' && <ButterflyFilter />}
      {filterId === 'ar_angel' && <AngelHalo />}
      {filterId === 'ar_devil' && <DevilHorns />}
      {filterId === 'ar_crown' && <PrincessCrown />}
      {filterId === 'ar_sunglasses' && <SunglassesFilter />}
      {filterId === 'ar_hearts' && <HeartEyes />}
      {filterId === 'ar_stars' && <StarDust />}
      {filterId === 'ar_rainbow' && <RainbowFilter />}
      {filterId === 'ar_galaxy' && <GalaxyFilter />}
      {filterId === 'ar_disco' && <DiscoFilter />}
      {filterId === 'ar_confetti' && <ConfettiFilter />}
      {filterId === 'ar_money' && <MoneyFilter />}
      {filterId === 'ar_bubble' && <BubbleFilter />}
      {filterId === 'ar_snow' && <SnowFilter />}
      {filterId === 'ar_alien' && <AlienFilter />}
      {filterId === 'ar_fire' && <FireFilter />}
      {filterId === 'ar_neon' && <NeonFilter />}
    </View>
  );
}

const s = StyleSheet.create({
  ear: {
    position: 'absolute',
  },
  earInner: {
    position: 'absolute',
    top: '18%',
    left: '18%',
    right: '18%',
    bottom: '22%',
    borderRadius: 20,
  },
  catEar: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  catEarInner: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
  },
  horn: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  nose: {
    position: 'absolute',
  },
  blush: {
    position: 'absolute',
    width: 48,
    height: 20,
    borderRadius: 12,
  },
  whisker: {
    position: 'absolute',
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
});
