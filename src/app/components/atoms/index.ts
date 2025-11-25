/**
 * Atoms Component Barrel Export
 * 
 * Atoms are the basic building blocks of the design system.
 * They are the smallest, most fundamental components that cannot be broken down further
 * without losing their meaning. Atoms include basic HTML elements styled with Tailwind CSS.
 * 
 * Examples: Button, Input, Badge, Avatar, Icon, Spinner
 * 
 * Characteristics:
 * - Single responsibility
 * - No business logic
 * - Highly reusable
 * - Design system foundation
 * - Pure UI components
 * 
 * @example
 * ```tsx
 * // Import individual atoms
 * import { Button } from '@/app/components/atoms';
 * 
 * // Import with types
 * import { Button, type ButtonProps, type ButtonVariant } from '@/app/components/atoms';
 * 
 * // Import from specific atom
 * import { Button } from '@/app/components/atoms/Button';
 * ```
 */

// Button Atom
export { Button, default as ButtonDefault } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

// Heading Atom
export { Heading } from './Heading/Heading';
export type { HeadingProps, HeadingAlign, HeadingLevel } from './Heading/Heading';

// Paragraph Atom
export { Paragraph } from './Paragraph/Paragraph';
export type { ParagraphProps, ParagraphSize, ParagraphAlign } from './Paragraph/Paragraph';

// Label Atom
export { Label } from './Label/Label';
export type { LabelProps, LabelSeverity, LabelVariant, LabelSize } from './Label/Label';

// Caption Atom
export { Caption } from './Caption/Caption';
export type { CaptionProps, CaptionSize, CaptionAlign, CaptionContrast } from './Caption/Caption';

// Link Atom
export { Link } from './Link/Link';
export type { LinkProps, LinkUnderline, LinkContrast, LinkSize } from './Link/Link';

// TextInput Atom
export { TextInput } from './TextInput/TextInput';
export type { TextInputProps, TextInputSize } from './TextInput/TextInput';

// TextArea Atom
export { TextArea } from './TextArea/TextArea';
export type { TextAreaProps, TextAreaSize } from './TextArea/TextArea';

// Checkbox Atom
export { Checkbox } from './Checkbox/Checkbox';
export type { CheckboxProps, CheckboxSize } from './Checkbox/Checkbox';

// RadioButton Atom
export { RadioButton } from './RadioButton/RadioButton';
export type { RadioButtonProps, RadioButtonSize } from './RadioButton/RadioButton';

// Dropdown Atom
export { Dropdown } from './Dropdown/Dropdown';
export type { DropdownProps, DropdownSize, DropdownVariant, DropdownOption } from './Dropdown/Dropdown';

// Toggle Atom
export { Toggle } from './Toggle/Toggle';
export type { ToggleProps, ToggleSize, ToggleVariant } from './Toggle/Toggle';

// SearchInput Atom
export { SearchInput } from './SearchInput';
export type { SearchInputProps, SearchInputSize, SearchInputVariant } from './SearchInput';

// Avatar Atom
export { Avatar } from './Avatar';
export type { AvatarProps, AvatarSize, AvatarVariant } from './Avatar';

// ProgressBar Atom
export { ProgressBar } from './ProgressBar';
export type { ProgressBarProps, ProgressBarSize, ProgressBarVariant } from './ProgressBar';

// Spinner Atom
export { Spinner } from './Spinner';
export type { SpinnerProps, SpinnerSize, SpinnerVariant } from './Spinner';

// Skeleton Atom
export { Skeleton } from './Skeleton';
export type { SkeletonProps, SkeletonShape, SkeletonSize, SkeletonVariant } from './Skeleton';

// PriceTag Atom
export { PriceTag } from './PriceTag';
export type { PriceTagProps, PriceTagSize, PriceTagVariant } from './PriceTag';

// Rating Atom
export { Rating, type RatingProps, type RatingSize, type RatingVariant } from './Rating';
