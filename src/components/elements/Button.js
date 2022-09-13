import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


const Button = ({
  className,
  tag,
  color,
  size,
  loading,
  wide,
  wideMobile,
  disabled,
  ...props
}) => {

  const classes = classNames(
    'button',
    color && `button-${color}`,
    size && `button-${size}`,
    loading && 'is-loading',
    wide && 'button-block',
    wideMobile && 'button-wide-mobile',
    className
  );

  return (
    <button
    {...props}
    className={classes}
    onClick={props.onClick}
    />
  );
}

export default Button;