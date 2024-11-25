import { TbBeach, TbDeviceAirpods, TbMountain, TbPool } from 'react-icons/tb';
import {
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCastle,
  GiCaveEntrance,
  GiForestCamp,
  GiIsland,
  GiWindmill,
} from 'react-icons/gi';
import { FaLaptop, FaLightbulb, FaMobileAlt, FaRegKeyboard, FaSkiing, FaTshirt } from 'react-icons/fa';
import { BsEmojiSunglasses, BsFillUsbDriveFill, BsSnow } from 'react-icons/bs';
import { IoDiamond } from 'react-icons/io5';
import { MdOutlineCable, MdOutlineVilla } from 'react-icons/md';
import { FaComputerMouse } from 'react-icons/fa6';
import { RiBattery2ChargeFill } from 'react-icons/ri';
import { SlEarphones } from 'react-icons/sl';
import { PiGlobeStand } from 'react-icons/pi';
import { FcSpeaker } from 'react-icons/fc';

interface Category {
  label: string;
  icon: React.ElementType; 
  description: string;
}

export const categories: Category[] = [
  {
    label: 'Mobile',
    icon: FaMobileAlt,
    description: 'This property is close to the mobile!',
  },
  {
    label: 'Mouse',
    icon: FaComputerMouse,
    description: 'This property has Mouse!',
  },
  {
    label: 'keyboard',
    icon: FaRegKeyboard,
    description: 'This property is keyboard!',
  },
  {
    label: 'Airpode',
    icon: TbDeviceAirpods,
    description: 'This property is in the Airpode!',
  },
  {
    label: 'Laptop',
    icon: FaLaptop,
    description: 'This property has a beautiful Laptop!',
  },
  {
    label: 'Charger',
    icon: RiBattery2ChargeFill,
    description: 'This property is on an Charger!',
  },
  {
    label: 'Cable',
    icon: MdOutlineCable,
    description: 'This property is near a cable!',
  },
  {
    label: 'Earphones',
    icon: SlEarphones,
    description: 'This property has skiing Earphones!',
  },
  {
    label: 'penDrive',
    icon: BsFillUsbDriveFill,
    description: 'This property is an ancient penDrive!',
  },
  {
    label: 'caves',
    icon: GiCaveEntrance,
    description: 'This property is in a spooky caves!',
  },
  {
    label: 'Stand',
    icon: PiGlobeStand,
    description: 'This property offers camping Stand!',
  },
  {
    label: 'Speaker',
    icon: FcSpeaker,
    description: 'This property is in an arctic Speaker!',
  },
  {
    label: 'Light',
    icon: FaLightbulb,
    description: 'This property is in the Light!',
  },
  {
    label: 'SunGlass',
    icon: BsEmojiSunglasses,
    description: 'This property is in a SunGlass!',
  },
  {
    label: 'Tshirt',
    icon: FaTshirt,
    description: 'This property is brand new and Tshirt!',
  },
];
