# Component Library

Deze map bevat alle Vue componenten van de Court Assist applicatie, georganiseerd in logische categorieën.

## Structuur

### `/ui/`
Basis UI componenten die overal in de applicatie gebruikt kunnen worden.
- **Button.vue** - Herbruikbare knop component met verschillende varianten

### `/navigation/`
Navigatie-gerelateerde componenten.
- **NavigationItem.vue** - Router-link navigatie item voor de sidebar
- **NavigationLink.vue** - Gewone link navigatie item voor de sidebar
- **SidebarHeader.vue** - Header van de sidebar met titel en toggle knoppen
- **SidebarFooter.vue** - Footer van de sidebar met profiel en sport wissel

### `/layout/`
Layout en structuur componenten.
- **PageContainer.vue** - Standaard container voor pagina's met padding en max-width
- **PageSection.vue** - Sectie component met witte achtergrond en schaduw

### `/common/`
Algemene herbruikbare componenten.
- **StatusBadge.vue** - Badge voor verschillende statussen (success, warning, error, etc.)
- **EmptyState.vue** - Component voor lege staten met icon, titel en actie
- **ExerciseBadge.vue** - Badge voor exercise eigenschappen (spelers, duur, intensiteit, veld)

### `/data/`
Data-gerelateerde componenten.
- **DataTable.vue** - Herbruikbare tabel component met sortering

### `/feedback/`
Feedback en interactie componenten.
- **LoadingSpinner.vue** - Loading spinner met verschillende groottes

### `/exercise/`
Exercise-specifieke componenten.
- **ExerciseForm.vue** - Formulier voor het maken/bewerken van oefeningen
- **ExercisesTopControls.vue** - Bovenste controls voor de oefeningen pagina
- **ExerciseListItem.vue** - Lijst item weergave van een oefening
- **ExerciseCardItem.vue** - Kaart weergave van een oefening

### `/form/`
Formulier componenten.
- **IntensitySelector.vue** - Selector voor intensiteit
- **SearchInput.vue** - Zoek input veld
- **RichTextEditor.vue** - Rich text editor
- **IconPicker.vue** - Icon picker component
- **RangeNumber.vue** - Range number input

### Overige componenten
- **Modal.vue** - Modal/dialog component
- **PageHeader.vue** - Pagina header met titel en acties
- **SortButton.vue** - Sorteer knop
- **FiltersPanel.vue** - Filter paneel
- **DeleteConfirm.vue** - Bevestigingsdialog voor verwijderen
- **MobileSidebarDrawer.vue** - Mobiele sidebar drawer
- **Sidebar.vue** - Hoofdsidebar component
- **FiltersChips.vue** - Filter chips weergave
- **NotificationBar.vue** - Notificatie balk
- **Pagination.vue** - Paginering component
- **Tooltip.vue** - Tooltip component

## Gebruik

Alle componenten kunnen geïmporteerd worden via de hoofdexport:

```javascript
import { 
  UiButton, 
  PageContainer, 
  StatusBadge,
  LoadingSpinner 
} from '@/components'
```

Of individueel:

```javascript
import { UiButton } from '@/components/ui/Button.vue'
import { PageContainer } from '@/components/layout'
```

## Icons

Alle Lucide icons zijn globaal geregistreerd via `src/icons.js` en beschikbaar als componenten in alle templates. **Geen individuele icon imports nodig!**

```vue
<template>
  <!-- Icons zijn direct beschikbaar -->
  <TrafficCone class="w-5 h-5" />
  <Star class="w-5 h-5" />
  <Users class="w-5 h-5" />
</template>
```

## Naming Conventions

- **UI componenten**: Prefix met `Ui` (bijv. `UiButton`)
- **Layout componenten**: Duidelijke beschrijvende namen (bijv. `PageContainer`)
- **Feature componenten**: Feature-specifieke namen (bijv. `ExerciseForm`)
- **Common componenten**: Generieke namen (bijv. `StatusBadge`)

## Consistentie

Alle componenten volgen dezelfde structuur:
- `<template>` sectie bovenaan
- `<script>` sectie met duidelijke props en emits
- `<style scoped>` sectie onderaan
- Consistente class naming met Tailwind CSS
- Duidelijke component namen in PascalCase
- **Geen overbodige imports** - gebruik globale registraties waar mogelijk
