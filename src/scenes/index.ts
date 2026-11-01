import type React from 'react';
import {Benzene} from './Benzene';
import {Carbon} from './Carbon';
import {Curve} from './Curve';
import {Exchange} from './Exchange';
import {Heitler} from './Heitler';
import {Hook} from './Hook';
import {Ionic} from './Ionic';
import {Lewis} from './Lewis';
import {LonePair} from './LonePair';
import {Outro} from './Outro';
import {Overlap} from './Overlap';
import {Oxygen} from './Oxygen';
import {Polymer} from './Polymer';
import {Promotion} from './Promotion';
import {Recap} from './Recap';
import {Roadmap} from './Roadmap';
import {Shapes} from './Shapes';
import {Sp} from './Sp';
import {Sp2} from './Sp2';
import {Sp3} from './Sp3';
import {SpinPair} from './SpinPair';
import {Title} from './Title';

// Pemetaan id scene di naskah → komponen visual.
export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  title: Title,
  roadmap: Roadmap,
  lewis: Lewis,
  curve: Curve,
  heitler: Heitler,
  exchange: Exchange,
  spinpair: SpinPair,
  ionic: Ionic,
  overlap: Overlap,
  promotion: Promotion,
  sp3: Sp3,
  sp2: Sp2,
  sp: Sp,
  lonepair: LonePair,
  shapes: Shapes,
  benzene: Benzene,
  carbon: Carbon,
  polymer: Polymer,
  oxygen: Oxygen,
  recap: Recap,
  outro: Outro,
};
