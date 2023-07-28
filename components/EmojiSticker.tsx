import React from 'react'
import { View, Image } from 'react-native'
import {
  TapGestureHandler,
  PanGestureHandler,
} from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated'

const AnimatedView = Animated.createAnimatedComponent(View)

export default function EmojiSticker({
  imageSize,
  stickerSource,
}: {
  imageSize: number
  stickerSource: any
}) {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const AnimatedImage = Animated.createAnimatedComponent(Image)
  const scaleImage = useSharedValue(imageSize)

  const onDoubleTap = useAnimatedGestureHandler<any>({
    onActive: () => {
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = scaleImage.value * 2
      }
    },
  })

  const onDrag = useAnimatedGestureHandler<any>({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value
      ctx.startY = translateY.value
    },
    onActive: (event, ctx: any) => {
      translateX.value = ctx.startX + event.translationX
      translateY.value = ctx.startY + event.translationY
    },
  })

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    }
  })

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    }
  })

  return (
    <PanGestureHandler onGestureEvent={onDrag}>
      <AnimatedView style={[containerStyle, { top: -350 }]}>
        <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}>
          <AnimatedImage
            source={stickerSource}
            resizeMode="contain"
            style={[imageStyle, { width: imageSize, height: imageSize }]}
          />
        </TapGestureHandler>
      </AnimatedView>
    </PanGestureHandler>
  )
}
