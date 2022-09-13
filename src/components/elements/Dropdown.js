import * as React from 'react';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { textAlign } from '@material-ui/system';

const Dropdown = (props) => {

  return (
        <FormControl
        style={{width:'40%', padding: '0', marginBottom:'8px', justifyContent: 'center', textAlign:'center'}}
        >
          <NativeSelect
            defaultValue='Popular'
            inputProps={{ id: 'uncontrolled-native' }}
            style={{ 
                width: '100%',
                background: "#6163FF", color: "#ECEDED",
                paddingTop:8, paddingBottom:8,
                fontSize: '100%', fontFamily: "Inter, sans-serif", fontWeight: 600,
                justifyContent: 'center'
            }}
            onChange={props.onChange}
          >
              <option style={{background: "#33363A"}} value='Popular'>Popular</option>
              <option style={{background: "#33363A"}} value='Hip-Hop'>Hip-Hop</option>
              <option style={{background: "#33363A"}} value='Rock'>Rock</option>
          </NativeSelect>
        </FormControl>
  );
}

export default Dropdown;