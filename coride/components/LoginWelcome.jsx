import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

export default function LoginWelcome() {
  const [typedText, setTypedText] = useState('');
  const [showHand, setShowHand] = useState(false);
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const handAnim = useRef(new Animated.Value(0)).current;

  const fullText = 'CoRide';
  const typingSpeed = 200;
  const indexRef = useRef(0); // holds the current character index

  // Typing Effect using useRef for index
  useEffect(() => {
    const typeChar = () => {
      if (indexRef.current < fullText.length) {
        const nextChar = fullText[indexRef.current];
        setTypedText(prev => prev + nextChar);
        indexRef.current += 1;
        setTimeout(typeChar, typingSpeed);
      } else {
        setTimeout(() => setShowHand(true), 500);
      }
    };

    setTimeout(typeChar, 1000); // Initial delay before typing starts
  }, []);

  // Cursor Blink Animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Hand wave animation
  useEffect(() => {
    if (showHand) {
      Animated.timing(handAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    }
  }, [showHand]);

  return (
    <View style={styles.container}>
        <Text style={styles.welcomeText}>
            Bienvenido a{' '}
            <Text style={styles.typing}>
                {typedText}
                <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>|</Animated.Text>

                {/* 👋 Hand shown inline after text */}
                {showHand && (
                <Animated.Text
                    style={[
                    styles.inlineHand,
                    {
                        opacity: handAnim,
                        transform: [
                        {
                            translateY: handAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                            }),
                        },
                        {
                            rotate: handAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: ['0deg', '30deg', '0deg'],
                            }),
                        },
                        ],
                    },
                    ]}
                >
                    {' '}👋
                </Animated.Text>
                )}
            </Text>
        </Text>
        <Text style={styles.descriptionText}>Tu aplicación para compartir viajes</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    color: '#2c3e50',
  },
  descriptionText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: 40
  },
  typing: {
    flexDirection: 'row',
    color: '#2c3e50',
  },
  cursor: {
    fontWeight: 'bold',
  },
  hand: {
    fontSize: 40,
    marginTop: 10,
  },
  inlineHand: {
    fontSize: 28, // match welcomeText size
    marginLeft: 4,
  },
});

