import {
  Box,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from '@mui/material'
import { Controller } from 'react-hook-form'

const DropdownComponent = ({ control, errors, name, label, options }: any) => {
  return (
    <Box display='flex' flexDirection='column' width={'170px'}>
      <FormControl>
        <label htmlFor={name} style={{ textAlign: 'left' }}>
          {label}
        </label>
        <Controller
          name={name}
          control={control}
          rules={{ required: `Please select a ${label.toLowerCase()}` }}
          defaultValue=''
          render={({ field }) => (
            <Select
              labelId={name}
              id={name}
              {...field}
              error={!!(errors && errors[name])}
            >
              {options &&
                options.map((option: any) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
            </Select>
          )}
        />
        {errors && errors[name] && (
          <FormHelperText style={{ color: 'red' }}>
            {errors[name]?.message?.toString()}
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  )
}

export default DropdownComponent
