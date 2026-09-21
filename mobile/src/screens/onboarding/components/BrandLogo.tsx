import { Text } from 'react-native';
import { styles } from '../styles';

export function BrandLogo() {
  return (
    <Text style={styles.logo}>
      Quick<Text style={styles.logoAccent}>Buzz</Text>
    </Text>
  );
}
