export const flex = `
    display:flex;
    flex-wrap:wrap;
`;
export const row = `
    ${flex}
    align-items:center;
`;
export const rowCenter = `
    ${row}
    justify-content:center;
`;

export const rowSpaceBetween = `
    ${row}
    justify-content:space-between;
`;

export const rowEnd = `
    ${row}
    justify-content: flex-end;
`;

export const col = `
    ${flex}
    flex-direction:column;
    flex-wrap:nowrap;
`;
export const colCenter = `
    ${col}
    justify-content:center;
    align-items:center;
`;
export const colSpaceBetween = `
    ${col}
    justify-content:center;
    align-items:space-between;
`;

export const colEnd = `
    ${col}
    justify-content: flex-end;
`;

export const relative = `
    position:relative;
`;
