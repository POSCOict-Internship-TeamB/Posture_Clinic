
import * as alignChild from './stylesheet/alignChild';
import * as alignSelf from './stylesheet/alignSelf';
// import * as mediaQuery from './stylesheet/mediaQuery';
import * as typo from './stylesheet/typo';
import * as values from './values';
import { default as round } from './stylesheet/round';
import { default as pad } from './stylesheet/pad';
import { default as spacing } from './stylesheet/spacing';

export * from './stylesheet';

const styles = {
  ...alignChild,
  ...alignSelf,
  //...mediaQuery,
  ...typo,
  ...values,
  round,
  pad,
  spacing,
};

export default styles;
