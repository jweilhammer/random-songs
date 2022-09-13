import * as React from 'react';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { textAlign } from '@material-ui/system';

const Dropdown = () => {
  const [age, setAge] = React.useState('Popular');

  const handleChange = (event) => {
    console.log("HELLO WORLD")
  };

  return (
        <FormControl
        style={{width:'40%', padding: '0', marginBottom:'8px'}}
        >
        <NativeSelect
            defaultValue={30}
            inputProps={{
            id: 'uncontrolled-native',
            }}
            style={{ 
                width: '100%',
                background: "#6163FF", color: "#ECEDED",
                paddingTop:8, paddingBottom:8,
                fontSize: '100%', fontFamily: "Inter, sans-serif", fontWeight: 600,
                justifyContent:'center'
            }}
            sx={{justifyContent:'center'}}
            onChange={handleChange}
        >
            <option  style={{background: "#33363A"}} value={10}>Ten</option>
            <option style={{background: "#33363A"}} value={20}>Twenty</option>
            <option  style={{background: "#33363A"}} value={30}>Thirty</option>
        </NativeSelect>
        </FormControl>
  );
}

export default Dropdown;