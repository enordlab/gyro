// gist.github.com/doojinkang  mpu6050.ino

#include "MPU6050.h"

uint8_t devAddr = 0x68;

// store calibration
float gyro_x_base = 0;
float gyro_y_base = 0;
float gyro_z_base = 0;
float accel_x_base = 0;
float accel_y_base = 0;
float accel_z_base = 0;

#define GYRO_FACTOR  131.0 * M_PI / 180

float roll, pitch, yaw;
unsigned long last_read_time = 0;

uint8_t buffer[14];

void calibrate_sensors() {
  int read_count = 10;

  int16_t gx, gy, gz;
  int16_t ax, ay, az;

  // Discard the first reading (don't know if this is needed or
  // not, however, it won't hurt.)
  I2Cdev::readBytes(devAddr, MPU6050_IMU::MPU6050_RA_GYRO_XOUT_H, 6, buffer);
  I2Cdev::readBytes(devAddr, MPU6050_IMU::MPU6050_RA_ACCEL_XOUT_H, 6, buffer);

  // Read and average the raw values
  for (int i = 0; i < read_count; i++) {
    I2Cdev::readBytes(devAddr, MPU6050_IMU::MPU6050_RA_GYRO_XOUT_H, 6, buffer);
    gx = (((int16_t)buffer[0]) << 8) | buffer[1];
    gy = (((int16_t)buffer[2]) << 8) | buffer[3];
    gz = (((int16_t)buffer[4]) << 8) | buffer[5];
    gyro_x_base += gx;
    gyro_y_base += gy;
    gyro_z_base += gz;
    I2Cdev::readBytes(devAddr, MPU6050_IMU::MPU6050_RA_ACCEL_XOUT_H, 6, buffer);
    ax = (((int16_t)buffer[0]) << 8) | buffer[1];
    ay = (((int16_t)buffer[2]) << 8) | buffer[3];
    az = (((int16_t)buffer[4]) << 8) | buffer[5];
    accel_x_base += ax;
    accel_y_base += ay;
    accel_z_base += az;
  }

  gyro_x_base /= read_count;
  gyro_y_base /= read_count;
  gyro_z_base /= read_count;
  accel_x_base /= read_count;
  accel_y_base /= read_count;
  accel_z_base /= read_count;

  Serial.print("Calibration : ");
  Serial.print(gyro_x_base);
  Serial.print(" ");
  Serial.print(gyro_y_base);
  Serial.print(" ");
  Serial.print(gyro_z_base);
  Serial.print(" ");
  Serial.print(accel_x_base);
  Serial.print(" ");
  Serial.print(accel_y_base);
  Serial.print(" ");
  Serial.println(accel_z_base);
}


void setup() {
  Serial.begin(115200);

  // I2C initialize
  Wire.begin();
  Wire.setClock(400000);

  // MPU6050 initialize
  // I2Cdev::writeBits(devAddr, MPU6050_RA_PWR_MGMT_1, MPU6050_PWR1_CLKSEL_BIT, MPU6050_PWR1_CLKSEL_LENGTH, MPU6050_CLOCK_PLL_XGYRO);
  I2Cdev::writeBits(devAddr, 0x6B, 2, 3, 0x01);

  // I2Cdev::writeBits(devAddr, MPU6050_RA_GYRO_CONFIG, MPU6050_GCONFIG_FS_SEL_BIT, MPU6050_GCONFIG_FS_SEL_LENGTH, MPU6050_GYRO_FS_250);
  // I2Cdev::writeBits(devAddr, 0x1B, 4, 2, 0x00);

  // I2Cdev::writeBits(devAddr, MPU6050_RA_ACCEL_CONFIG, MPU6050_ACONFIG_AFS_SEL_BIT, MPU6050_ACONFIG_AFS_SEL_LENGTH, MPU6050_ACCEL_FS_2);
  // I2Cdev::writeBits(devAddr, 0x1C, 4, 2, 0x00);

  // I2Cdev::writeBit(devAddr, MPU6050_RA_PWR_MGMT_1, MPU6050_PWR1_SLEEP_BIT, false);
  I2Cdev::writeBit(devAddr, 0x6B, 6, false);

  uint8_t buffer;
  I2Cdev::readBits(devAddr, MPU6050_IMU::MPU6050_RA_WHO_AM_I, MPU6050_IMU::MPU6050_WHO_AM_I_BIT, MPU6050_IMU::MPU6050_WHO_AM_I_LENGTH, &buffer);
  Serial.print("DEVICE ID : ");
  Serial.println(buffer, 16);
  I2Cdev::readBits(devAddr, MPU6050_IMU::MPU6050_RA_GYRO_CONFIG, 4, 2, &buffer);
  Serial.print("GYRO_FS_BIT : ");
  Serial.println(buffer);
  // I2Cdev::readBits(devAddr, MPU6050_RA_ACCEL_CONFIG, 4, 2, &buffer);
  // Serial.print("ACCEL_FS_BIT : ");
  // Serial.println(buffer);

  calibrate_sensors();

  while (!Serial.available());  // wait until something in
  // last_read_time = millis();
}

void loop() {

  // 1. gyro ==> angle
  I2Cdev::readBytes(devAddr, MPU6050_IMU::MPU6050_RA_GYRO_XOUT_H, 6, buffer);
  int16_t gx = (((int16_t)buffer[0]) << 8) | buffer[1];
  int16_t gy = (((int16_t)buffer[2]) << 8) | buffer[3];
  int16_t gz = (((int16_t)buffer[4]) << 8) | buffer[5];

  // 16bit integer => rad/s
  float fgx = (gx - gyro_x_base) / GYRO_FACTOR;  // 16bitVal / 131.0 * M_PI / 180 ==> rad/s
  float fgy = (gy - gyro_y_base) / GYRO_FACTOR;
  float fgz = (gz - gyro_z_base) / GYRO_FACTOR;

  // current time (ms)
  unsigned long t_now = millis();
  float dt =(t_now - last_read_time)/1000.0;
  last_read_time = t_now;

  roll  = roll  + dt * fgx;
  pitch = pitch + dt * fgy;
  yaw   = yaw   + dt * fgz;

  // 2. accelerometer ==> angle
  I2Cdev::readBytes(devAddr, MPU6050_IMU::MPU6050_RA_ACCEL_XOUT_H, 6, buffer);
  int16_t ax = (((int16_t)buffer[0]) << 8) | buffer[1];
  int16_t ay = (((int16_t)buffer[2]) << 8) | buffer[3];
  int16_t az = (((int16_t)buffer[4]) << 8) | buffer[5];

  float fax = ax; // + accel_x_base;
  float fay = ay; // + accel_y_base;
  float faz = az; // + accel_z_base;

  float a_roll  = atan2(fay, sqrt(fax*fax + faz*faz));
  float a_pitch = -atan2(fax, sqrt(fay*fay + faz*faz));
  float a_yaw   = 0.0f;

  // 3. gyro * 0.95 + accel * 0.05
  roll  = 0.95 * roll  + 0.05 * a_roll;
  pitch = 0.95 * pitch + 0.05 * a_pitch;

  Serial.print(roll);
  Serial.print(",");
  Serial.print(pitch);
  Serial.print(",");
  Serial.println(yaw);
  Serial.flush();
  delay(100);
}
