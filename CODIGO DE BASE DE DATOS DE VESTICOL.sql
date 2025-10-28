-- MariaDB Script
-- Database: VESTICOL
-- Compatible with MariaDB

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema VESTICOL
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS `VESTICOL` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `VESTICOL`;

-- -----------------------------------------------------
-- Table USUARIOS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `USUARIOS` (
  `cedula_usuario` INT(10) NOT NULL,
  `correo_usuario` VARCHAR(100) NULL,
  `contraseña_usuario` VARCHAR(100) NULL,
  `tipo_doc_usuario` VARCHAR(20) NULL,
  `nombre_usuario` VARCHAR(100) NULL,
  `fc_nac_usuario` DATE NULL,
  `genero_usuario` VARCHAR(100) NULL,
  `rol_usuario` VARCHAR(100) NULL,
  PRIMARY KEY (`cedula_usuario`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Roles: empleado, administrador, cliente

-- -----------------------------------------------------
-- Table PROVEEDORES
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Table CATEGORIAS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CATEGORIAS` (
  `id_categoria` INT(10) NOT NULL AUTO_INCREMENT,
  `nombre_categoria` VARCHAR(100) NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `CATEGORIAS` (`id_categoria`, `nombre_categoria`) VALUES 
(1, 'Calzado'),
(2, 'Ropa'),
(3, 'Accesorios'),
(4, 'Todos');

-- -----------------------------------------------------
-- Table ORDENES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ORDENES` (
  `codigo_orden` INT(15) NOT NULL AUTO_INCREMENT,
  `cedula_usuario` INT(10) NULL,
  `fecha_compra_orde` DATE NULL,
  `precio_total_orden` DECIMAL(10,2) NULL,
  `USUARIOS_cedula_usuario` INT(10) NOT NULL,
  `detalles_orden` VARCHAR(200) NULL,
  PRIMARY KEY (`codigo_orden`),
  INDEX `fk_Ordenes_Usuarios1_idx` (`USUARIOS_cedula_usuario` ASC),
  CONSTRAINT `fk_Ordenes_Usuarios1`
    FOREIGN KEY (`USUARIOS_cedula_usuario`)
    REFERENCES `USUARIOS` (`cedula_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table VENTAS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `VENTAS` (
  `cod_venta` INT(10) NOT NULL AUTO_INCREMENT,
  `fecha_venta` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `Valor_total_venta` DECIMAL(10,2) NULL,
  `direccion_destino_venta` VARCHAR(45) NULL,
  `Usuarios_cedula_usuario` INT(10) NOT NULL,
  PRIMARY KEY (`cod_venta`, `Usuarios_cedula_usuario`),
  INDEX `fk_Ventas_Usuarios1_idx` (`Usuarios_cedula_usuario` ASC),
  CONSTRAINT `fk_Ventas_Usuarios1`
    FOREIGN KEY (`Usuarios_cedula_usuario`)
    REFERENCES `USUARIOS` (`cedula_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table PRODUCTOS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PRODUCTOS` (
  `cod_producto` VARCHAR(14) NOT NULL,
  `nombre_producto` VARCHAR(100) NULL,
  `descripcion_producto` TEXT NULL,
  `precio_producto` DECIMAL(10,2) NULL,
  `talla_producto` VARCHAR(10) NULL,
  `color_producto` VARCHAR(50) NULL,
  `genero_producto` VARCHAR(9) NULL,
  `stock_producto` INT(4) NULL,
  `imagen_producto` VARCHAR(255) NULL,
  `categoria_producto` VARCHAR(50) NULL,
  `Categorias_id_categoria` INT(10) NOT NULL,
  PRIMARY KEY (`cod_producto`),
  CONSTRAINT `fk_Productos_Categorias1`
    FOREIGN KEY (`Categorias_id_categoria`)
    REFERENCES `CATEGORIAS` (`id_categoria`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `PRODUCTOS` (`cod_producto`, `nombre_producto`, `descripcion_producto`, `precio_producto`, `talla_producto`, `color_producto`, `genero_producto`, `stock_producto`, `imagen_producto`, `categoria_producto`, `Categorias_id_categoria`) VALUES 
('H001', 'Camiseta Unicolor Color Blanco optico Quest', 'Camiseta para Hombre, Unicolor con Cuello redondo. Color Blanco optico. Estampado Unicolor. Composición: 96% algodon, 4% elastano * El modelo mide 1,90m y usa una prenda talla M. Tener una gran cantidad de camisetas a mano es clave cuando se trata de tu guardarropa.', 44900.00, 'M', 'Blanco', 'Masculino', 50, '/sueterquestblanco.jpg', 'Ropa', 2),
('H002', 'Nike Max Aura 7', 'Para los Max Aura 7, tomamos los éxitos de los AJ10 y AJ11 y diseñamos una combinación moderna, perfecta para el uso diario. Los detalles ondulados junto a las agujetas se inspiran directamente de los AJ10. ¿Y la protección antilodo de charol y la goma translúcida de la suela? Son un guiño a los AJ11.', 754950.00, '42', 'Negro', 'Masculino', 30, '/NikeMaxAura7.jpg', 'Calzado', 3),
('H003', 'Pantalón Clásico Brahma', 'Pantalón cómodo para ocasiones casuales marca Brahma color cafe, compuesto por un 98% de algodon y un 2% de elastano.', 269900.00, '32', 'Cafe', 'Masculino', 20, '/pantalonbrahma.jpg', 'Ropa', 2), 
('H004', 'Reloj Invicta Venom', 'Reloj de lujo marca Invicta, modelo Pro Driver, con movimiento automático y diseño elegante.', 899900.00, 'U', 'Dorado', 'Masculino', 10, '/INVICTA-VENOM.jpg', 'Accesorios', 4);


INSERT INTO `PRODUCTOS` (`cod_producto`, `nombre_producto`, `descripcion_producto`, `precio_producto`, `talla_producto`, `color_producto`, `genero_producto`, `stock_producto`, `imagen_producto`, `categoria_producto`, `Categorias_id_categoria`) VALUES
('F001', 'Camisa con encaje negra para mujer', 'Camisa elegante con detalles de encaje en las mangas. Ideal para ocasiones especiales.', 77950.00, 'S', 'Negro', 'Femenino', 25, '/camisamujer.jpg', 'Ropa', 2),
('F002', 'Pantalon palazzo tiro alto negro con bota ancha' , 'Pantalón palazzo de tiro alto en color negro, con bota ancha y diseño moderno.', 89900.00, 'M', 'Negro', 'Femenino', 15, '/pantalonpalazzo.jpg', 'Ropa', 2),
('F003', 'Zapatos Tenis Zamba', 'Zapatos deportivos cómodos y versátiles, ideales para el uso diario.', 599950.00, 'M', 'Blanco', 'Femenino', 10, '/tenis-zamba-mujer.jpg', 'Calzado', 3),
('F004', 'Marquee Blanco Velez', 'Bolso de mano de diseño elegante, ideal para ocasiones especiales.', 739900.00, 'U', 'Negro', 'Femenino', 5, '/bolso.jpg', 'Accesorios', 4);






-- -----------------------------------------------------
-- Table COMPRAS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `COMPRAS` (
  `cod_compra` INT(10) NOT NULL AUTO_INCREMENT,
  `Cantidad_compra` INT(20) NULL,
  `Valor_compra` DECIMAL(10,2) NULL,
  `Proveedores_cod_proveedor` INT(10) NOT NULL,
  PRIMARY KEY (`cod_compra`, `Proveedores_cod_proveedor`),
  INDEX `fk_COMPRAS_Proveedores1_idx` (`Proveedores_cod_proveedor` ASC),
  CONSTRAINT `fk_COMPRAS_Proveedores1`
    FOREIGN KEY (`Proveedores_cod_proveedor`)
    REFERENCES `PROVEEDORES` (`cod_proveedor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;