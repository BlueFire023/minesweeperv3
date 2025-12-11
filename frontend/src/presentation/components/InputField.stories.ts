import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputField } from './InputField';

//👇 This default export determines where your story goes in the story list
const meta = {
    component: InputField,
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        label: 'Input Field',
        id: 'input-field',
        numberValue: 10,
        rangeMin: 5,
        rangeMax: 50,
        suffix: '',
    },
    tags: ['autodocs'],
};