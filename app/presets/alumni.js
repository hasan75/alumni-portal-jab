import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

const AlumniPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#2563EB',
      600: '#1d4ed8',
      700: '#1e40af',
      800: '#1e3a8a',
      900: '#1e3366',
      950: '#172554',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}',
        },
        surface: {
          0: '#ffffff',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E5E7EB',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
      },
      dark: {
        primary: {
          color: '{primary.400}',
          contrastColor: '{surface.900}',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },
        highlight: {
          background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
          focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
        surface: {
          0: '#ffffff',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E5E7EB',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
      },
    },
  },
  components: {
    button: {
      colorScheme: {
        light: {
          root: {
            primary: {
              background: '{primary.500}',
              hoverBackground: '{primary.600}',
              activeBackground: '{primary.700}',
              borderColor: '{primary.500}',
              hoverBorderColor: '{primary.600}',
              activeBorderColor: '{primary.700}',
              color: '#ffffff',
              hoverColor: '#ffffff',
              activeColor: '#ffffff',
            },
            secondary: {
              background: 'transparent',
              hoverBackground: '{surface.50}',
              activeBackground: '{surface.100}',
              borderColor: '{surface.200}',
              hoverBorderColor: '{surface.300}',
              activeBorderColor: '{surface.400}',
              color: '{surface.700}',
              hoverColor: '{surface.800}',
              activeColor: '{surface.900}',
            },
          },
        },
      },
      borderRadius: '{border.radius.md}',
      paddingX: '1.5rem',
      paddingY: '0.75rem',
      fontWeight: '500',
    },
    card: {
      colorScheme: {
        light: {
          root: {
            background: '#ffffff',
            color: '{surface.800}',
          },
          subtitle: {
            color: '{surface.600}',
          },
        },
      },
      borderRadius: '{border.radius.lg}',
      shadow: 'none',
    },
    inputtext: {
      colorScheme: {
        light: {
          root: {
            background: '#ffffff',
            borderColor: '{surface.200}',
            hoverBorderColor: '{surface.300}',
            focusBorderColor: '{primary.500}',
            color: '{surface.800}',
          },
        },
      },
      borderRadius: '{border.radius.md}',
    },
    badge: {
      colorScheme: {
        light: {
          primary: {
            background: '{primary.100}',
            color: '{primary.700}',
          },
          success: {
            background: 'color-mix(in srgb, #34C759 15%, transparent)',
            color: '#1a7a35',
          },
          danger: {
            background: 'color-mix(in srgb, #FF3B30 12%, transparent)',
            color: '#c0251d',
          },
          warn: {
            background: 'color-mix(in srgb, #FF9500 15%, transparent)',
            color: '#884400',
          },
          info: {
            background: 'color-mix(in srgb, #007AFF 12%, transparent)',
            color: '#004ecc',
          },
        },
      },
      borderRadius: '{border.radius.full}',
      paddingX: '0.75rem',
      paddingY: '0.25rem',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
  },
})

export default AlumniPreset
