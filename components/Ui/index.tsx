import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "../../constants/theme";

/**
 * Badge - Pequeña etiqueta
 */
interface BadgeProps {
  label: string;
  variant?: "primary" | "success" | "warning" | "danger" | "info";
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = "primary" }) => {
  const variants = {
    primary: { bg: Colors.primaryLight, color: Colors.primary },
    success: { bg: "#E8F8F5", color: Colors.success },
    warning: { bg: "#FEF5E7", color: Colors.warning },
    danger: { bg: "#FADBD8", color: Colors.danger },
    info: { bg: "#D6EAF8", color: Colors.info },
  };

  const style = variants[variant];

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[Typography.labelSmall, { color: style.color }]}>
        {label}
      </Text>
    </View>
  );
};

/**
 * Button - Botón personalizado
 */
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
}) => {
  const variantStyles = {
    primary: {
      bg: Colors.primary,
      text: Colors.white,
      border: Colors.primary,
    },
    secondary: {
      bg: Colors.white,
      text: Colors.primary,
      border: Colors.primary,
    },
    danger: {
      bg: Colors.danger,
      text: Colors.white,
      border: Colors.danger,
    },
    ghost: {
      bg: "transparent",
      text: Colors.primary,
      border: Colors.lightGray,
    },
  };

  const sizeStyles = {
    small: {
      padding: Spacing.sm,
      fontSize: 12,
    },
    medium: {
      padding: Spacing.md,
      fontSize: 14,
    },
    large: {
      padding: Spacing.lg,
      fontSize: 16,
    },
  };

  const style = variantStyles[variant];
  const size_style = sizeStyles[size];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled ? Colors.disabled : style.bg,
          borderColor: style.border,
          paddingVertical: size_style.padding,
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? "100%" : "auto",
        },
      ]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={style.text} />
      ) : (
        <Text
          style={[
            Typography.label,
            { color: style.text, fontSize: size_style.fontSize },
          ]}
        >
          {/* FIX: !! fuerza booleano — icon es string | undefined */}
          {!!icon && `${icon} `}
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

/**
 * Card - Contenedor estilizado
 */
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
};

/**
 * Section - Sección con título
 */
interface SectionProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  subtitle,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[Typography.h4, { color: Colors.dark }]}>{title}</Text>
        {/* FIX: !! fuerza booleano — subtitle es string | undefined */}
        {!!subtitle && (
          <Text style={[Typography.bodySmall, { color: Colors.gray }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
};

/**
 * Empty State - Cuando no hay resultados
 */
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>{icon}</Text>
      <Text
        style={[Typography.h4, { color: Colors.dark, marginTop: Spacing.lg }]}
      >
        {title}
      </Text>
      <Text
        style={[
          Typography.bodySmall,
          { color: Colors.gray, marginTop: Spacing.sm, textAlign: "center" },
        ]}
      >
        {description}
      </Text>
      {/* action es objeto | undefined — seguro sin !! */}
      {action && (
        <Button
          label={action.label}
          onPress={action.onPress}
          variant="primary"
        />
      )}
    </View>
  );
};

/**
 * Loading Skeleton - Para estados de carga
 */
export const SkeletonLoader: React.FC = () => {
  return (
    <View style={styles.skeleton}>
      <View style={[styles.skeletonLine, styles.skeletonLineWide]} />
      <View style={[styles.skeletonLine, { marginTop: Spacing.md }]} />
      <View style={[styles.skeletonLine, { marginTop: Spacing.md }]} />
    </View>
  );
};

/**
 * Divider - Separador
 */
interface DividerProps {
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({ style }) => {
  return <View style={[styles.divider, style]} />;
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.small,
    alignSelf: "flex-start",
  },
  button: {
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.medium,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionHeader: {
    marginBottom: Spacing.lg,
  },
  sectionContent: {
    gap: Spacing.lg,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: Spacing.lg,
  },
  emptyStateIcon: {
    fontSize: 64,
  },
  skeleton: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.small,
  },
  skeletonLineWide: {
    width: "80%",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
});