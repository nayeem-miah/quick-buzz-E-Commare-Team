import { BsFillUsbDriveFill } from 'react-icons/bs';
import { FaLaptop, FaMobileAlt, FaRegKeyboard } from 'react-icons/fa';
import { FaComputerMouse } from 'react-icons/fa6';
import { MdOutlineCable } from 'react-icons/md';
import { RiBattery2ChargeFill } from 'react-icons/ri';
import { SlEarphones } from 'react-icons/sl';
import { TbDeviceAirpods } from 'react-icons/tb';

interface Category {
  label: string;
  icon: React.ElementType;
  description: string;
}

export const categories: Category[] = [
  {
    label: 'Mobile',
    icon: FaMobileAlt,
    description: 'Phones and mobile accessories.',
  },
  {
    label: 'Mouse',
    icon: FaComputerMouse,
    description: 'Computer mice and accessories.',
  },
  {
    label: 'Keyboard',
    icon: FaRegKeyboard,
    description: 'Keyboard options for work and gaming.',
  },
  {
    label: 'AirPods',
    icon: TbDeviceAirpods,
    description: 'Wireless audio and earbuds.',
  },
  {
    label: 'Laptop',
    icon: FaLaptop,
    description: 'Portable computing devices.',
  },
  {
    label: 'Charger',
    icon: RiBattery2ChargeFill,
    description: 'Charging solutions for everyday devices.',
  },
  {
    label: 'Cable',
    icon: MdOutlineCable,
    description: 'High-quality cables and adapters.',
  },
  {
    label: 'Earphones',
    icon: SlEarphones,
    description: 'Wired and wireless audio gear.',
  },
  {
    label: 'PenDrive',
    icon: BsFillUsbDriveFill,
    description: 'Portable storage and USB drives.',
  },
];
