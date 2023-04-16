import React from 'react'

import fi_box from './img/fi_box.svg'
import heading_yaw from './img/heading_yaw.svg'
import heading_mechanics from './img/heading_mechanics.svg'
import fi_circle from './img/fi_circle.svg'
import vertical_mechanics from './img/vertical_mechanics.svg'
import fi_needle from './img/fi_needle.svg'
import turn_coordinator from './img/turn_coordinator.svg'
import fi_tc_airplane from './img/fi_tc_airplane.svg'
import speed_mechanics from './img/speed_mechanics.svg'
import altitude_pressure from './img/altitude_pressure.svg'
import altitude_ticks from './img/altitude_ticks.svg'
import fi_needle_small from './img/fi_needle_small.svg'
import horizon_back from './img/horizon_back.svg'
import horizon_ball from './img/horizon_ball.svg'
import horizon_circle from './img/horizon_circle.svg'
import horizon_mechanics from './img/horizon_mechanics.svg'

const constants = {
  pitch_bound: 30,
  vario_bound: 1.95,
  airspeed_bound_l: 0,
  airspeed_bound_h: 160
}

const box = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0
}

const Instrument = ({ children, showBox, size }) => {
  return (
    <div className="instrument heading" style={{ 
      height: size ?? '250px',
      width: size ?? '250px',
      position: 'relative',
      display: 'inline-block',
      overflow: 'hidden'
    }}>
      {(showBox ?? true) &&
        <img src={fi_box} className="background box" style={box} alt="" />
      }
      {children}
    </div>
  )
}

export const HeadingIndicator = (params) => {
  return (
    <Instrument {...params}>
      <div className="heading box" style={{ ...box, transform: `rotate(${-params.heading ?? 0}deg)` }}>
        <img src={heading_yaw} className="box" style={box} alt="" />
      </div>
      <div className="mechanics box" style={box}>
        <img src={heading_mechanics} className="box" style={box} alt="" />
        <img src={fi_circle} className="box" style={box} alt="" />
      </div>
    </Instrument>
  )
}

export const Variometer = (params) => {
  let vario = (params.vario ?? 0) / 1000

  if (vario > constants.vario_bound) vario = constants.vario_bound
  else if (vario < -constants.vario_bound) vario = -constants.vario_bound

  vario = vario * 90;

  return (
    <Instrument {...params}>
      <img src={vertical_mechanics} className="box" style={box} alt="" />
      <div className="vario box" style={{ ...box, transform: `rotate(${vario}deg)` }}>
        <img src={fi_needle} className="box" style={box} alt="" />
      </div>
      <div className="mechanics box" style={box}>
        <img src={fi_circle} className="box" style={box} alt="" />
      </div>
    </Instrument>
  )
}

export const TurnCoordinator = (params) => {
  return (
    <Instrument {...params}>
      <img src={turn_coordinator} className="box" style={box} alt="" />
      <div className="turn box" style={{ ...box, transform: `rotate(${params.turn}deg)` }}>
        <img src={fi_tc_airplane} className="box" style={box} alt="" />
      </div>
      <div className="mechanics box" style={box}>
        <img src={fi_circle} className="box" style={box} alt="" />
      </div>
    </Instrument>
  )
}

export const Airspeed = (params) => {
  let speed = params.speed ?? 0

  if (speed > constants.airspeed_bound_h) speed = constants.airspeed_bound_h
  else if (speed < constants.airspeed_bound_l) speed = constants.airspeed_bound_l

  speed = 90 + speed * 2

  return (
    <Instrument {...params}>
      <img src={speed_mechanics} className="box" style={box} alt="" />
      <div className="speed box" style={{ ...box, transform: `rotate(${speed}deg)` }}>
        <img src={fi_needle} className="box" style={box} alt="" />
      </div>
      <div className="mechanics box" style={box}>
        <img src={fi_circle} className="box" style={box} alt="" />
      </div>
    </Instrument>
  )
}

export const Altimeter = (params) => {
  let altitude = params.altitude ?? 0
  let needle = 90 + altitude % 1000 * 360 / 1000
  let needleSmall = altitude / 10000 * 360

  let pressure = params.pressure ?? 1013.25
  pressure = 2 * pressure - 1980

  return (
    <Instrument {...params}>
      <div className="pressure box" style={{ ...box, transform: `rotate(${pressure}deg)` }}>
        <img src={altitude_pressure} className="box" style={box} alt="" />
      </div>
      <img src={altitude_ticks} className="box" style={box} alt="" />
      <div className="needleSmall box" style={{ ...box, transform: `rotate(${needleSmall}deg)` }}>
        <img src={fi_needle_small} className="box" style={box} alt="" />
      </div>
      <div className="needle box" style={{ ...box, transform: `rotate(${needle}deg)` }}>
        <img src={fi_needle} className="box" style={box} alt="" />
      </div>
      <div className="mechanics box" style={box}>
        <img src={fi_circle} className="box" style={box} alt="" />
      </div>
    </Instrument>
  )
}

export const AttitudeIndicator = (params) => {
  let pitch = params.pitch ?? 0
  if (pitch > constants.pitch_bound) { pitch = constants.pitch_bound; }
  else if (pitch < -constants.pitch_bound) { pitch = -constants.pitch_bound; }

  return (
    <Instrument {...params}>
      <div className="roll box" style={{ ...box, top: '0%', transform: `rotate(${params.roll ?? 0}deg)` }}>
        <img src={horizon_back} className="box" alt="" style={{ ...box }} />
        <div className="pitch box" style={{ ...box, top: `${(pitch) * 0.7}%` }}>
          <img src={horizon_ball} className="box" style={box} alt="" />
        </div>
        <img src={horizon_circle} className="box" style={box} alt="" />
      </div>
      <div className="mechanics box" style={box}>
        <img src={horizon_mechanics} className="box" style={box} alt="" />
        <img src={fi_circle} className="box" style={box} alt="" />
      </div>
    </Instrument>
  )
}
