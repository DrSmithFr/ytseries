export const breakpoint = {
  mobile: 500,
  tablet: 900,
  desktop: 1200,
}
export const mediaQuery = {
  mobileXs: `(max-width: ${breakpoint.mobile - 1}px)`,
  mobileXl: `(min-width: ${breakpoint.mobile}px) and (max-width: ${breakpoint.tablet - 1}px)`,
  tablet: `(min-width: ${breakpoint.tablet}px) and (max-width: ${breakpoint.desktop - 1}px)`,
  desktop: `(min-width: ${breakpoint.desktop}px)`,
};

