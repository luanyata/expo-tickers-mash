import { StyleSheet, Image } from 'react-native'

export default function ImageViewer({
  placeholderImageSource,
  selectedImage,
}: {
  placeholderImageSource: any
  selectedImage: any
}) {
  const imageSource = selectedImage
    ? { uri: selectedImage }
    : placeholderImageSource

  return <Image source={imageSource} style={styles.image} alt="" />
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
})
