import { TbDeviceAirpods } from 'react-icons/tb';
import {
  GiCaveEntrance,
} from 'react-icons/gi';
import { 
  FaLaptop, 
  FaLightbulb, 
  FaMobileAlt, 
  FaRegKeyboard, 
  FaTshirt 
} from 'react-icons/fa';
import { 
  BsEmojiSunglasses, 
  BsFillUsbDriveFill 
} from 'react-icons/bs';
import { 
  MdOutlineCable 
} from 'react-icons/md';
import { 
  FaComputerMouse 
} from 'react-icons/fa6';
import { 
  RiBattery2ChargeFill 
} from 'react-icons/ri';
import { 
  SlEarphones 
} from 'react-icons/sl';
import { 
  PiGlobeStand 
} from 'react-icons/pi';
import { 
  FcSpeaker 
} from 'react-icons/fc';

interface Category {
  label: string;
  icon: React.ElementType; 
  description: string;
}

export const categories: Category[] = [
  {
    label: 'Mobile',
    icon: FaMobileAlt,
    description: 'This category includes mobile devices and accessories.',
  },
  {
    label: 'Mouse',
    icon: FaComputerMouse,
    description: 'This category includes computer mice.',
  },
  {
    label: 'Keyboard',
    icon: FaRegKeyboard,
    description: 'This category offers a variety of keyboards.',
  },
  {
    label: 'AirPods',
    icon: TbDeviceAirpods,
    description: 'This category includes AirPods and wireless earphones.',
  },
  {
    label: 'Laptop',
    icon: FaLaptop,
    description: 'This category features different types of laptops.',
  },
  {
    label: 'Charger',
    icon: RiBattery2ChargeFill,
    description: 'This category has various chargers for devices.',
  },
  {
    label: 'Cable',
    icon: MdOutlineCable,
    description: 'This category offers high-quality cables.',
  },
  {
    label: 'Earphones',
    icon: SlEarphones,
    description: 'This category includes wired and wireless earphones.',
  },
  {
    label: 'PenDrive',
    icon: BsFillUsbDriveFill,
    description: 'This category includes USB pen drives.',
  },
  {
    label: 'Caves',
    icon: GiCaveEntrance,
    description: 'Explore properties near caves.',
  },
  {
    label: 'Stand',
    icon: PiGlobeStand,
    description: 'This category offers globe stands and related products.',
  },
  {
    label: 'Speaker',
    icon: FcSpeaker,
    description: 'This category includes various speakers.',
  },
  {
    label: 'Light',
    icon: FaLightbulb,
    description: 'This category features lighting solutions.',
  },
  {
    label: 'Sunglasses',
    icon: BsEmojiSunglasses,
    description: 'This category offers stylish sunglasses.',
  },
  {
    label: 'T-shirt',
    icon: FaTshirt,
    description: 'This category includes trendy t-shirts.',
  },
];
