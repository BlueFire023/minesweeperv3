import type { Meta, StoryObj } from '@storybook/react-vite';

import {TextField} from "./TextField";

//👇 This default export determines where your story goes in the story list
const meta = {
    component: TextField,
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        label: 'Game Name',
        id: 'input-field',
    },
    tags: ['autodocs'],
};