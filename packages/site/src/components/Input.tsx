import React from 'react';
import styled from 'styled-components';

const Input = styled.input`
  display: block;
  width: 90%;
  padding: 1rem;
  margin-bottom: 2rem;
  font-size: ${(props) => props.theme.fontSizes.text};
  border: 1px solid ${(props) => props.theme.colors.border?.default};
  border-radius: ${(props) => props.theme.radii.default};
  background-color: ${(props) => props.theme.colors.background?.default};
  color: ${(props) => props.theme.colors.text?.default};
  transition: all 0.2s ease-in-out;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
  }
  &:focus {
    outline: none;
    border: 1px solid ${(props) => props.theme.colors.primary?.default};
  }
`;

type CustomInputProps = {
  placeholder?: string;
  value?: string;
  label?: string;
  max?: string;
  min?: string;
  setValue: (value: string) => void;
};

export const CustomInput: React.FC<CustomInputProps> = (props) => {
  return (
    <Input
      type="number"
      {...props}
      onChange={(eventInput) => props.setValue(eventInput.target.value)}
    />
  );
};
