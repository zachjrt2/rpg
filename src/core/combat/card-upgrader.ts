import type { CombatCard } from '../types/cards.ts';

/**
 * Upgrades a combat card into its enhanced (+) tier with amplified damage, block, heals, and status potency
 */
export function upgradeCombatCard(card: CombatCard): CombatCard {
  if (card.isUpgraded) return card;

  const nextDamage = card.damage ? Math.round(card.damage * 1.35 + 3) : undefined;
  const nextMagicDamage = card.magicDamage ? Math.round(card.magicDamage * 1.35 + 3) : undefined;
  const nextBlock = card.block ? Math.round(card.block * 1.35 + 3) : undefined;
  const nextHeal = card.heal ? Math.round(card.heal * 1.35 + 3) : undefined;

  const nextStatus = card.statusEffects?.map((s) => ({
    ...s,
    potency: s.potency ? s.potency + 2 : s.potency,
    duration: s.duration ? s.duration + 1 : s.duration,
  }));

  // Clean description with upgraded values
  let updatedDesc = card.description;
  if (card.damage && nextDamage) {
    updatedDesc = updatedDesc.replace(`${card.damage}`, `${nextDamage}`);
  }
  if (card.block && nextBlock) {
    updatedDesc = updatedDesc.replace(`${card.block}`, `${nextBlock}`);
  }
  if (card.heal && nextHeal) {
    updatedDesc = updatedDesc.replace(`${card.heal}`, `${nextHeal}`);
  }

  return {
    ...card,
    id: card.id.endsWith('+') ? card.id : `${card.id}+`,
    name: card.name.endsWith('+') ? card.name : `${card.name}+`,
    isUpgraded: true,
    damage: nextDamage,
    magicDamage: nextMagicDamage,
    block: nextBlock,
    heal: nextHeal,
    statusEffects: nextStatus,
    description: updatedDesc,
  };
}
