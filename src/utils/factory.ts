import ts = require('typescript');
import { getNumberFromNumericLiteral, isExpressionNumbericLiteral } from './ast';

type FieldData = {
  size: number;
  offset: number;
};

export function createBufferAccess(buffer: ts.Expression, address: ts.Expression, readSize: number) {
  const shiftBy = Math.log2(readSize);

  if (shiftBy === 0) {
    return ts.factory.createElementAccessExpression(
      buffer,
      address
    );
  }

  if (isExpressionNumbericLiteral(address)) {
    return ts.factory.createElementAccessExpression(
      buffer,
      ts.factory.createNumericLiteral(
        getNumberFromNumericLiteral(address) >>> shiftBy
      ),
    );
  }

  return ts.factory.createElementAccessExpression(
    buffer,
    createRightShiftedExpression(
      ts.factory.createParenthesizedExpression(address),
      ts.factory.createNumericLiteral(shiftBy),
    ),
  );
}


export function createRightShiftedExpression(expToShift: ts.Expression, shiftExp: ts.Expression) {
  return ts.factory.createBinaryExpression(
    expToShift,
    ts.factory.createToken(ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken),
    shiftExp,
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

export function createReadBy1Byte(buffer: ts.Expression, address: ts.Expression, element: ts.Expression, structSize: number, fieldData: FieldData) {
  if (fieldData.size === 1) {
    return createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 1);
  } else if (fieldData.size === 2) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createLeftShiftedExpression(
          createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 1), 1),
          ts.factory.createNumericLiteral(8),
        ),
        ts.factory.createToken(ts.SyntaxKind.BarToken),
        createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 1),
      )
    );
  } else if (fieldData.size === 4) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createLeftShiftedExpression(
          createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 3), 1),
          ts.factory.createNumericLiteral(24),
        ),
        ts.factory.createToken(ts.SyntaxKind.BarToken),
        ts.factory.createBinaryExpression(
          createLeftShiftedExpression(
            createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 2), 1),
            ts.factory.createNumericLiteral(16),
          ),
          ts.factory.createToken(ts.SyntaxKind.BarToken),
          ts.factory.createBinaryExpression(
            createLeftShiftedExpression(
              createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 1), 1),
              ts.factory.createNumericLiteral(8),
            ),
            ts.factory.createToken(ts.SyntaxKind.BarToken),
            createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 1),
          )
        )
      )
    );
  }

  return undefined;
}

export function createReadBy2Byte(buffer: ts.Expression, address: ts.Expression, element: ts.Expression, structSize: number, fieldData: FieldData) {
  if (fieldData.size === 1) {
    return createLogicalAnd(
      createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 2),
      ts.factory.createNumericLiteral('0xFF'),
    );
  } else if (fieldData.size === 2) {
    return createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 2);
  } else if (fieldData.size === 4) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createLeftShiftedExpression(
          createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 2), 2),
          ts.factory.createNumericLiteral(16),
        ),
        ts.factory.createToken(ts.SyntaxKind.BarToken),
        createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 2),
      )
    );
  }

  return undefined;
}

export function createReadBy4Byte(buffer: ts.Expression, address: ts.Expression, element: ts.Expression, structSize: number, fieldData: FieldData) {
  if (fieldData.size === 1) {
    return  createLogicalAnd(
      createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 4),
      ts.factory.createNumericLiteral('0xFF'),
    );
  } else if (fieldData.size === 2) {
    return  createLogicalAnd(
      createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 4),
      ts.factory.createNumericLiteral('0xFFFF'),
    );
  } else if (fieldData.size === 4) {
    return createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 4);
  }

  return undefined;
}

// Little-endian
export function createWriteBy1Byte(buffer: ts.Expression, address: ts.Expression, element: ts.Expression, structSize: number, fieldData: FieldData, value: ts.Expression) {
  if (fieldData.size === 1) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 1),
        ts.factory.createToken(ts.SyntaxKind.EqualsToken),
        ts.factory.createParenthesizedExpression(
          createLogicalAnd(value, ts.factory.createNumericLiteral('0xFF'))
        )
      )
    );
  } else if (fieldData.size === 2) {
    return createCommanNode(
      ts.factory.createParenthesizedExpression(
        ts.factory.createBinaryExpression(
          createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 1),
          ts.factory.createToken(ts.SyntaxKind.EqualsToken),
          ts.factory.createParenthesizedExpression(
            createLogicalAnd(value, ts.factory.createNumericLiteral('0xFF'))
          )
        )
      ),
      ts.factory.createParenthesizedExpression(
        ts.factory.createBinaryExpression(
          createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 1), 1),
          ts.factory.createToken(ts.SyntaxKind.EqualsToken),
          ts.factory.createParenthesizedExpression(
            createLogicalAnd(
              ts.factory.createParenthesizedExpression(
                createRightShiftedExpression(value, ts.factory.createNumericLiteral('8'))
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
          createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 1),
          ts.factory.createToken(ts.SyntaxKind.EqualsToken),
          ts.factory.createParenthesizedExpression(
            createLogicalAnd(value, ts.factory.createNumericLiteral('0xFF'))
          )
        )
      ),
      createCommanNode(
        ts.factory.createParenthesizedExpression(
          ts.factory.createBinaryExpression(
            createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 1), 1),
            ts.factory.createToken(ts.SyntaxKind.EqualsToken),
            ts.factory.createParenthesizedExpression(
              createLogicalAnd(
                ts.factory.createParenthesizedExpression(
                  createRightShiftedExpression(value, ts.factory.createNumericLiteral('8'))
                ),
                ts.factory.createNumericLiteral('0xFF')
              )
            )
          )
        ),
        createCommanNode(
          ts.factory.createParenthesizedExpression(
            ts.factory.createBinaryExpression(
              createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 2), 1),
              ts.factory.createToken(ts.SyntaxKind.EqualsToken),
              ts.factory.createParenthesizedExpression(
                createLogicalAnd(
                  ts.factory.createParenthesizedExpression(
                    createRightShiftedExpression(value, ts.factory.createNumericLiteral('16'))
                  ),
                  ts.factory.createNumericLiteral('0xFF')
                )
              )
            )
          ),
          ts.factory.createParenthesizedExpression(
            ts.factory.createBinaryExpression(
              createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 3), 1),
              ts.factory.createToken(ts.SyntaxKind.EqualsToken),
              ts.factory.createParenthesizedExpression(
                createLogicalAnd(
                  ts.factory.createParenthesizedExpression(
                    createRightShiftedExpression(value, ts.factory.createNumericLiteral('24'))
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
export function createWriteBy2Byte(buffer: ts.Expression, address: ts.Expression, element: ts.Expression, structSize: number, fieldData: FieldData, value: ts.Expression) {
  if (fieldData.size === 1) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 2),
        ts.factory.createToken(ts.SyntaxKind.EqualsToken),
        ts.factory.createParenthesizedExpression(
          createLogicalAnd(value, ts.factory.createNumericLiteral('0xFF'))
        )
      )
    );
  } else if (fieldData.size === 2) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 2),
        ts.factory.createToken(ts.SyntaxKind.EqualsToken),
        ts.factory.createParenthesizedExpression(
          createLogicalAnd(value, ts.factory.createNumericLiteral('0xFFFF'))
        )
      )
    );
  } else if (fieldData.size === 4) {
    return createCommanNode(
      ts.factory.createParenthesizedExpression(
        ts.factory.createBinaryExpression(
          createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 2),
          ts.factory.createToken(ts.SyntaxKind.EqualsToken),
          ts.factory.createParenthesizedExpression(
            createLogicalAnd(value, ts.factory.createNumericLiteral('0xFFFF'))
          )
        )
      ),
      ts.factory.createParenthesizedExpression(
        ts.factory.createBinaryExpression(
          createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 2), 2),
          ts.factory.createToken(ts.SyntaxKind.EqualsToken),
          ts.factory.createParenthesizedExpression(
            createLogicalAnd(
              ts.factory.createParenthesizedExpression(
                createRightShiftedExpression(value, ts.factory.createNumericLiteral('16'))
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
export function createWriteBy4Byte(buffer: ts.Expression, address: ts.Expression, element: ts.Expression, structSize: number, fieldData: FieldData, value: ts.Expression) {
  if (fieldData.size === 1) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 4),
        ts.factory.createToken(ts.SyntaxKind.EqualsToken),
        ts.factory.createParenthesizedExpression(
          createLogicalAnd(value, ts.factory.createNumericLiteral('0xFF'))
        )
      )
    );
  } else if (fieldData.size === 2) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 4),
        ts.factory.createToken(ts.SyntaxKind.EqualsToken),
        ts.factory.createParenthesizedExpression(
          createLogicalAnd(value, ts.factory.createNumericLiteral('0xFFFF'))
        )
      )
    );
  } else if (fieldData.size === 4) {
    return ts.factory.createParenthesizedExpression(
      ts.factory.createBinaryExpression(
        createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 4),
        ts.factory.createToken(ts.SyntaxKind.EqualsToken),
        value
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
