import ts = require('typescript');
import { getNumberFromNumericLiteral, isExpressionNumbericLiteral } from './ast';

type FieldData = {
  size: number;
  offset: number;
};

export function createStructReadOffsetNode(structSize: number, elementIndxExp: ts.Expression, fieldOffset: number) {
  const structOffsetNode = ts.factory.createBinaryExpression(
    ts.factory.createNumericLiteral(structSize),
    ts.factory.createToken(ts.SyntaxKind.AsteriskToken),
    elementIndxExp
  );

  return ts.factory.createBinaryExpression(
    structOffsetNode,
    ts.factory.createToken(ts.SyntaxKind.PlusToken),
    ts.factory.createNumericLiteral(fieldOffset)
  );
}

export function createBufferAccessFrom1ByteNode(bufferExp: ts.Expression, structSize: number, elementIndxExp: ts.Expression, fieldOffset: number) {
  const structOffsetNode = createStructReadOffsetNode(structSize, elementIndxExp, fieldOffset);

  return ts.factory.createElementAccessExpression(
    bufferExp,
    structOffsetNode
  );
}

export function createBufferAccessFrom2ByteNode(bufferExp: ts.Expression, structSize: number, elementIndxExp: ts.Expression, fieldOffset: number) {
  const structOffsetNode = createStructReadOffsetNode(structSize, elementIndxExp, fieldOffset);

  return ts.factory.createElementAccessExpression(
    bufferExp,
    createRightShiftedExpression(
      ts.factory.createParenthesizedExpression(structOffsetNode),
      ts.factory.createNumericLiteral(1),
    ),
  );
}

export function createBufferAccessFrom4ByteNode(bufferExp: ts.Expression, structSize: number, elementIndxExp: ts.Expression, fieldOffset: number) {
  const structOffsetNode = createStructReadOffsetNode(structSize, elementIndxExp, fieldOffset);

  return ts.factory.createElementAccessExpression(
    bufferExp,
    createRightShiftedExpression(
      ts.factory.createParenthesizedExpression(structOffsetNode),
      ts.factory.createNumericLiteral(2),
    ),
  );
}

export function createLeftShiftedExpression(expToShift: ts.Expression, shiftExp: ts.Expression) {
  return ts.factory.createParenthesizedExpression(
    ts.factory.createBinaryExpression(
      expToShift,
      ts.factory.createToken(ts.SyntaxKind.LessThanLessThanToken),
      shiftExp,
    )
  );
}

export function createRightShiftedExpression(expToShift: ts.Expression, shiftExp: ts.Expression) {
  return ts.factory.createBinaryExpression(
    expToShift,
    ts.factory.createToken(ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken),
    shiftExp,
  );
}

export function createLogicalAnd(expToAnd: ts.Expression, andExp: ts.Expression) {
  return ts.factory.createBinaryExpression(
    expToAnd,
    ts.factory.createToken(ts.SyntaxKind.AmpersandToken),
    andExp,
  );
}


export function createCommanNode(firstExp: ts.Expression, secondExp: ts.Expression) {
  return ts.factory.createBinaryExpression(
    firstExp,
    ts.factory.createToken(ts.SyntaxKind.CommaToken),
    secondExp,
  );
}

export function createReadBy1Byte(bufferExp: ts.Expression, elementIndxExp: ts.Expression, structSize: number, fieldData: FieldData) {
  if (fieldData.size === 1) {
    return createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset);
  } else if (fieldData.size === 2) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createLeftShiftedExpression(
          createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 1),
          ts.factory.createNumericLiteral(8),
        ),
        ts.factory.createToken(ts.SyntaxKind.BarToken),
        createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset),
      )
    );
  } else if (fieldData.size === 4) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createLeftShiftedExpression(
          createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 3),
          ts.factory.createNumericLiteral(24),
        ),
        ts.factory.createToken(ts.SyntaxKind.BarToken),
        ts.factory.createBinaryExpression(
          createLeftShiftedExpression(
            createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 2),
            ts.factory.createNumericLiteral(16),
          ),
          ts.factory.createToken(ts.SyntaxKind.BarToken),
          ts.factory.createBinaryExpression(
            createLeftShiftedExpression(
              createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 1),
              ts.factory.createNumericLiteral(8),
            ),
            ts.factory.createToken(ts.SyntaxKind.BarToken),
            createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset),
          )
        )
      )
    );
  }

  return undefined;
}

export function createReadBy2Byte(bufferExp: ts.Expression, elementIndxExp: ts.Expression, structSize: number, fieldData: FieldData) {
  if (fieldData.size === 1) {
    return  createLogicalAnd(
      createBufferAccessFrom2ByteNode(
        bufferExp,
        structSize,
        elementIndxExp,
        fieldData.offset
      ),
      ts.factory.createNumericLiteral('0xFF'),
    );
  } else if (fieldData.size === 2) {
    return createBufferAccessFrom2ByteNode(
      bufferExp,
      structSize,
      elementIndxExp,
      fieldData.offset
    );
  } else if (fieldData.size === 4) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createLeftShiftedExpression(
          createBufferAccessFrom2ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 2),
          ts.factory.createNumericLiteral(16),
        ),
        ts.factory.createToken(ts.SyntaxKind.BarToken),
        createBufferAccessFrom2ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset),
      )
    );
  }

  return undefined;
}

export function createReadBy4Byte(bufferExp: ts.Expression, elementIndxExp: ts.Expression, structSize: number, fieldData: FieldData) {
  if (fieldData.size === 1) {
    return  createLogicalAnd(
      createBufferAccessFrom4ByteNode(
        bufferExp,
        structSize,
        elementIndxExp,
        fieldData.offset
      ),
      ts.factory.createNumericLiteral('0xFF'),
    );
  } else if (fieldData.size === 2) {
    return  createLogicalAnd(
      createBufferAccessFrom4ByteNode(
        bufferExp,
        structSize,
        elementIndxExp,
        fieldData.offset
      ),
      ts.factory.createNumericLiteral('0xFFFF'),
    );
  } else if (fieldData.size === 4) {
    return createBufferAccessFrom4ByteNode(
      bufferExp,
      structSize,
      elementIndxExp,
      fieldData.offset
    );
  }

  return undefined;
}

// Little-endian
export function createWriteBy1Byte(bufferExp: ts.Expression, elementIndxExp: ts.Expression, structSize: number, fieldData: FieldData, valueExp: ts.Expression) {
  if (fieldData.size === 1) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset),
        ts.factory.createToken(ts.SyntaxKind.EqualsToken),
        ts.factory.createParenthesizedExpression(
          createLogicalAnd(valueExp, ts.factory.createNumericLiteral('0xFF'))
        )
      )
    );
  } else if (fieldData.size === 2) {
    return createCommanNode(
      ts.factory.createParenthesizedExpression(
        ts.factory.createBinaryExpression(
          createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset),
          ts.factory.createToken(ts.SyntaxKind.EqualsToken),
          ts.factory.createParenthesizedExpression(
            createLogicalAnd(valueExp, ts.factory.createNumericLiteral('0xFF'))
          )
        )
      ),
      ts.factory.createParenthesizedExpression(
        ts.factory.createBinaryExpression(
          createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 1),
          ts.factory.createToken(ts.SyntaxKind.EqualsToken),
          ts.factory.createParenthesizedExpression(
            createLogicalAnd(
              ts.factory.createParenthesizedExpression(
                createRightShiftedExpression(valueExp, ts.factory.createNumericLiteral('8'))
              ),
              ts.factory.createNumericLiteral('0xFF')
            )
          )
        )
      ),
    );
  } else if (fieldData.size === 4) {
    return createCommanNode(
      ts.factory.createParenthesizedExpression(
        ts.factory.createBinaryExpression(
          createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset),
          ts.factory.createToken(ts.SyntaxKind.EqualsToken),
          ts.factory.createParenthesizedExpression(
            createLogicalAnd(valueExp, ts.factory.createNumericLiteral('0xFF'))
          )
        )
      ),
      createCommanNode(
        ts.factory.createParenthesizedExpression(
          ts.factory.createBinaryExpression(
            createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 1),
            ts.factory.createToken(ts.SyntaxKind.EqualsToken),
            // create separete func getNByteFromExp
            ts.factory.createParenthesizedExpression(
              createLogicalAnd(
                ts.factory.createParenthesizedExpression(
                  createRightShiftedExpression(valueExp, ts.factory.createNumericLiteral('8'))
                ),
                ts.factory.createNumericLiteral('0xFF')
              )
            )
          )
        ),
        createCommanNode(
          ts.factory.createParenthesizedExpression(
            ts.factory.createBinaryExpression(
              createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 2),
              ts.factory.createToken(ts.SyntaxKind.EqualsToken),
              ts.factory.createParenthesizedExpression(
                createLogicalAnd(
                  ts.factory.createParenthesizedExpression(
                    createRightShiftedExpression(valueExp, ts.factory.createNumericLiteral('16'))
                  ),
                  ts.factory.createNumericLiteral('0xFF')
                )
              )
            )
          ),
          ts.factory.createParenthesizedExpression(
            ts.factory.createBinaryExpression(
              createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 3),
              ts.factory.createToken(ts.SyntaxKind.EqualsToken),
              ts.factory.createParenthesizedExpression(
                createLogicalAnd(
                  ts.factory.createParenthesizedExpression(
                    createRightShiftedExpression(valueExp, ts.factory.createNumericLiteral('24'))
                  ),
                  ts.factory.createNumericLiteral('0xFF')
                )
              )
            )
          ),
        )
      )
    );
  }

  return undefined;
}

// Little-endian
export function createWriteBy2Byte(bufferExp: ts.Expression, elementIndxExp: ts.Expression, structSize: number, fieldData: FieldData, valueExp: ts.Expression) {
  if (fieldData.size === 1) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createBufferAccessFrom2ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset),
        ts.factory.createToken(ts.SyntaxKind.EqualsToken),
        ts.factory.createParenthesizedExpression(
          createLogicalAnd(valueExp, ts.factory.createNumericLiteral('0xFF'))
        )
      )
    );
  } else if (fieldData.size === 2) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createBufferAccessFrom2ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset),
        ts.factory.createToken(ts.SyntaxKind.EqualsToken),
        ts.factory.createParenthesizedExpression(
          createLogicalAnd(valueExp, ts.factory.createNumericLiteral('0xFFFF'))
        )
      )
    );
  } else if (fieldData.size === 4) {
    return createCommanNode(
      ts.factory.createParenthesizedExpression(
        ts.factory.createBinaryExpression(
          createBufferAccessFrom2ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset),
          ts.factory.createToken(ts.SyntaxKind.EqualsToken),
          ts.factory.createParenthesizedExpression(
            createLogicalAnd(valueExp, ts.factory.createNumericLiteral('0xFFFF'))
          )
        )
      ),
      ts.factory.createParenthesizedExpression(
        ts.factory.createBinaryExpression(
          createBufferAccessFrom2ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 2),
          ts.factory.createToken(ts.SyntaxKind.EqualsToken),
          ts.factory.createParenthesizedExpression(
            createLogicalAnd(
              ts.factory.createParenthesizedExpression(
                createRightShiftedExpression(valueExp, ts.factory.createNumericLiteral('16'))
              ),
              ts.factory.createNumericLiteral('0xFFFF')
            )
          )
        )
      ),
    );
  }

  return undefined;
}

// Little-endian
export function createWriteBy4Byte(bufferExp: ts.Expression, elementIndxExp: ts.Expression, structSize: number, fieldData: FieldData, valueExp: ts.Expression) {
  if (fieldData.size === 1) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createBufferAccessFrom4ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset),
        ts.factory.createToken(ts.SyntaxKind.EqualsToken),
        ts.factory.createParenthesizedExpression(
          createLogicalAnd(valueExp, ts.factory.createNumericLiteral('0xFF'))
        )
      )
    );
  } else if (fieldData.size === 2) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createBufferAccessFrom4ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset),
        ts.factory.createToken(ts.SyntaxKind.EqualsToken),
        ts.factory.createParenthesizedExpression(
          createLogicalAnd(valueExp, ts.factory.createNumericLiteral('0xFFFF'))
        )
      )
    );
  } else if (fieldData.size === 4) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createBufferAccessFrom4ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset),
        ts.factory.createToken(ts.SyntaxKind.EqualsToken),
        valueExp
      )
    );
  }

  return undefined;
}

export function createEffectAddress(address: ts.Expression, element: ts.Expression, structSize: number, fieldOffset: number) {
  if (isExpressionNumbericLiteral(element)) {
    element = ts.factory.createNumericLiteral(getNumberFromNumericLiteral(element) * structSize);
  } else {
    element = ts.factory.createBinaryExpression(
      element,
      ts.factory.createToken(ts.SyntaxKind.AsteriskToken),
      ts.factory.createNumericLiteral(structSize)
    );
  }

  if (isExpressionNumbericLiteral(address)) {
    const resultOffset = getNumberFromNumericLiteral(address) + fieldOffset;

    if (isExpressionNumbericLiteral(element)) {
      return ts.factory.createNumericLiteral(resultOffset + getNumberFromNumericLiteral(element));
    }

    if (resultOffset === 0) {
      return element;
    }

    return ts.factory.createBinaryExpression(
      ts.factory.createNumericLiteral(resultOffset),
      ts.factory.createToken(ts.SyntaxKind.PlusToken),
      element
    );
  }

  if (isExpressionNumbericLiteral(element)) {
    const resultOffset = getNumberFromNumericLiteral(element) + fieldOffset;

    if (resultOffset === 0) {
      return address;
    }

    return ts.factory.createBinaryExpression(
      address,
      ts.factory.createToken(ts.SyntaxKind.PlusToken),
      ts.factory.createNumericLiteral(resultOffset)
    );
  }

  const elementWithFieldOffset = fieldOffset !== 0 ?
    ts.factory.createBinaryExpression(
      element,
      ts.factory.createToken(ts.SyntaxKind.PlusToken),
      ts.factory.createNumericLiteral(fieldOffset)
    ) : element;

  return ts.factory.createBinaryExpression(
    address,
    ts.factory.createToken(ts.SyntaxKind.PlusToken),
    elementWithFieldOffset
  );
}
