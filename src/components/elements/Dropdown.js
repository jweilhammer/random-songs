import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

const Dropdown = (props) => {

  return (
        <FormControl
        style={{width:'40%', padding: '0', marginBottom:'8px'}}
        >
          <NativeSelect
            defaultValue='Popular'
            inputProps={{ id: 'uncontrolled-native' }}
            style={{ 
                width: '100%',
                background: "#6163FF", color: "#ECEDED",
                paddingTop:8, paddingBottom:8,
                fontSize: '100%', fontFamily: "Inter, sans-serif", fontWeight: 600,
                justifyContent: 'center',
                textAlign: 'center'
            }}
            onChange={props.onChange}
          >
          
          {
            props.categories.map((category) =>
              <option style={{background: "#33363A"}} value={category} key={category}>
                {category}
              </option>
            )
          }
          </NativeSelect>
        </FormControl>
  );
}

export default Dropdown;