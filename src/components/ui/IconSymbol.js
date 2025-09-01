import Icon from 'react-native-vector-icons/MaterialIcons';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}) {
  return <Icon name={name} size={size} color={color} style={style} />;
}