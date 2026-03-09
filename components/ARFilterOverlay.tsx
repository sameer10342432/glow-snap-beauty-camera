import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SCREEN_W = Dimensions.get('window').width;
const SCREEN_H = Dimensions.get('window').height;

export interface ARFilterDef {
  id: string;
  name: string;
  thumbnail: string;
}

export const AR_FILTERS: ARFilterDef[] = [
  { id: 'ar_none', name: 'Off', thumbnail: '🚫' },
  { id: 'ar_dog', name: 'Puppy', thumbnail: '🐶' },
  { id: 'ar_cat', name: 'Kitty', thumbnail: '🐱' },
  { id: 'ar_bunny', name: 'Bunny', thumbnail: '🐰' },
  { id: 'ar_flowers', name: 'Bloom', thumbnail: '🌸' },
  { id: 'ar_angel', name: 'Angel', thumbnail: '😇' },
  { id: 'ar_devil', name: 'Devil', thumbnail: '😈' },
  { id: 'ar_crown', name: 'Queen', thumbnail: '👑' },
  { id: 'ar_hearts', name: 'Love', thumbnail: '💖' },
  { id: 'ar_stars', name: 'Star', thumbnail: '⭐' },
  { id: 'ar_rainbow', name: 'Rainbow', thumbnail: '🌈' },
  { id: 'ar_snow', name: 'Frost', thumbnail: '❄️' },
  { id: 'ar_alien', name: 'Alien', thumbnail: '👽' },
  { id: 'ar_fire', name: 'Fire', thumbnail: '🔥' },
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
      {filterId === 'ar_flowers' && <FlowerCrown />}
      {filterId === 'ar_angel' && <AngelHalo />}
      {filterId === 'ar_devil' && <DevilHorns />}
      {filterId === 'ar_crown' && <PrincessCrown />}
      {filterId === 'ar_hearts' && <HeartEyes />}
      {filterId === 'ar_stars' && <StarDust />}
      {filterId === 'ar_rainbow' && <RainbowFilter />}
      {filterId === 'ar_snow' && <SnowFilter />}
      {filterId === 'ar_alien' && <AlienFilter />}
      {filterId === 'ar_fire' && <FireFilter />}
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
