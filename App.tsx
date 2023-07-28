import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import Button from './components/Button'
import ImageViewer from './components/ImageViewer'
import * as ImagePicker from 'expo-image-picker'
import { useRef, useState } from 'react'
import IconButton from './components/IconButton'
import CircleButton from './components/CircleButton'
import EmojiPicker from './components/EmojiPicker'
import EmojiList from './components/EmojiList'
import EmojiSticker from './components/EmojiSticker'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as MediaLibrary from 'expo-media-library'
import { captureRef } from 'react-native-view-shot'

export default function App() {
  const imageRef = useRef<any>()

  const [status, requestPermission] = MediaLibrary.usePermissions()

  if (status === null) {
    requestPermission()
  }

  const [pickedEmoji, setPickedEmoji] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [showAppOtions, setShowAppOtions] = useState(false)
  const [selectedImage, setSetselectedImage] = useState<any>(null)

  const onReset = () => {
    setShowAppOtions(false)
  }

  const onAddSticker = () => {
    setIsModalVisible(true)
  }

  const onModalClose = () => {
    setIsModalVisible(false)
  }

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      })

      await MediaLibrary.saveToLibraryAsync(localUri)

      if (localUri) alert('Image saved to gallery')
    } catch (error) {
      console.log(error)
    }
  }

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setSetselectedImage(result.assets[0].uri)
      setShowAppOtions(true)
    } else {
      alert('You did not select an image.')
    }
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer
            placeholderImageSource={require('./assets/images/background-image.png')}
            selectedImage={selectedImage}
          />

          {pickedEmoji !== null ? (
            <EmojiSticker imageSize={100} stickerSource={pickedEmoji} />
          ) : null}
        </View>
      </View>

      {showAppOtions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton
              icon="save-alt"
              label="Save"
              onPress={onSaveImageAsync}
            />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button
            theme="primary"
            label="Choose a photo"
            onPress={pickImageAsync}
          />
          <Button
            label="Use this photo"
            onPress={() => setShowAppOtions(true)}
          />
        </View>
      )}

      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>

      <StatusBar style="auto" />
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
