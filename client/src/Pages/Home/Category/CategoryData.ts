import { TbBeach, TbMountain, TbPool } from 'react-icons/tb';
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
import { FaSkiing } from 'react-icons/fa';
import { BsSnow } from 'react-icons/bs';
import { IoDiamond } from 'react-icons/io5';
import { MdOutlineVilla } from 'react-icons/md';

interface Category {
  label: string;
  icon: React.ElementType; 
  description: string;
}

export const categories: Category[] = [
  {
    label: 'Phone',
    icon: TbBeach,
    description: 'This property is close to the Phone!',
  },
  {
    label: 'Mouse',
    icon: GiWindmill,
    description: 'This property has Mouse!',
  },
  {
    label: 'keyboard',
    icon: MdOutlineVilla,
    description: 'This property is keyboard!',
  },
  {
    label: 'Airpode',
    icon: TbMountain,
    description: 'This property is in the Airpode!',
  },
  {
    label: 'Laptop',
    icon: TbPool,
    description: 'This property has a beautiful Laptop!',
  },
  {
    label: 'Charger',
    icon: GiIsland,
    description: 'This property is on an Charger!',
  },
  {
    label: 'Cable',
    icon: GiBoatFishing,
    description: 'This property is near a cable!',
  },
  {
    label: 'Earphones',
    icon: FaSkiing,
    description: 'This property has skiing Earphones!',
  },
  {
    label: 'PenDrive',
    icon: GiCastle,
    description: 'This property is an ancient penDrive!',
  },
  {
    label: 'Caves',
    icon: GiCaveEntrance,
    description: 'This property is in a spooky Caves!',
  },
  {
    label: 'Stand',
    icon: GiForestCamp,
    description: 'This property offers camping Stand!',
  },
  {
    label: 'Speaker',
    icon: BsSnow,
    description: 'This property is in an arctic Speaker!',
  },
  {
    label: 'Light',
    icon: GiCactus,
    description: 'This property is in the Light!',
  },
  {
    label: 'Pent',
    icon: GiBarn,
    description: 'This property is in a pent!',
  },
  {
    label: 'Tshirt',
    icon: IoDiamond,
    description: 'This property is brand new and Tshirt!',
  },
];
