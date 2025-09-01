import { TouchableOpacity } from 'react-native';

export function HapticTab(props) {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.7}
    />
  );
}