import { Linking, Platform, Text } from 'react-native';

export function ExternalLink({ href, children, ...rest }) {
  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      await Linking.openURL(href);
    }
  };

  return (
    <Text onPress={handlePress} {...rest}>
      {children}
    </Text>
  );
}
