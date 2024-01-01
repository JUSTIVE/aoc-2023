import { A, F, S, flow } from '@mobily/ts-belt';
import { rotateMatrix } from '../utilities';

const expand = (input: readonly string[]): readonly string[] => {
  const emptyIdxs = input.filterWithIndex((i, row) =>
    pipe(row, S.split(''), A.every(F.equals('.'))),
  );
};

const expandGravity = flow(expand, rotateMatrix, expand, rotateMatrix);
