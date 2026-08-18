import type { CombatCard } from '../types/cards.ts';
import type { Combatant } from '../types/combat.ts';

export interface CardScalingBreakdown {
  base: number;
  bonus: number;
  total: number;
  statFormula: string;
}

export interface ScaledCardValues {
  damage?: CardScalingBreakdown;
  magicDamage?: CardScalingBreakdown;
  block?: CardScalingBreakdown;
  heal?: CardScalingBreakdown;
}

/**
 * Calculates attribute-scaled values for combat cards and provides mathematical breakdown formulas
 */
export function calculateScaledCardValues(card: CombatCard, hero?: Combatant): ScaledCardValues {
  if (!hero) {
    return {
      damage: card.damage ? { base: card.damage, bonus: 0, total: card.damage, statFormula: `Base: ${card.damage}` } : undefined,
      magicDamage: card.magicDamage ? { base: card.magicDamage, bonus: 0, total: card.magicDamage, statFormula: `Base: ${card.magicDamage}` } : undefined,
      block: card.block ? { base: card.block, bonus: 0, total: card.block, statFormula: `Base: ${card.block}` } : undefined,
      heal: card.heal ? { base: card.heal, bonus: 0, total: card.heal, statFormula: `Base: ${card.heal}` } : undefined,
    };
  }

  const str = hero.primaryStats?.strength || 10;
  const dex = hero.primaryStats?.dexterity || 10;
  const int = hero.primaryStats?.intelligence || 10;
  const vit = hero.primaryStats?.vitality || 10;
  const wil = hero.primaryStats?.willpower || 10;

  const physAtkBonus = Math.max(0, Math.floor((hero.derivedStats?.physicalAttack || 0) * 0.25));
  const magAtkBonus = Math.max(0, Math.floor((hero.derivedStats?.magicAttack || 0) * 0.25));
  const defBonus = Math.max(0, Math.floor((hero.derivedStats?.physicalDefense || 0) * 0.2));

  const result: ScaledCardValues = {};

  // 1. Physical Attack Scaling: Base + Math.floor(STR * 0.4 + DEX * 0.2) + Attack Power
  if (card.damage && card.damage > 0) {
    const statBonus = Math.floor(str * 0.4 + dex * 0.2);
    const bonus = statBonus + physAtkBonus;
    const total = card.damage + bonus;
    const formulaExtra = physAtkBonus > 0 ? ` + ${physAtkBonus} Atk Power` : '';
    result.damage = {
      base: card.damage,
      bonus,
      total,
      statFormula: `Base ${card.damage} + ${statBonus} Phys Scaling (${str} STR, ${dex} DEX)${formulaExtra}`,
    };
  }

  // 2. Magic Attack Scaling: Base + Math.floor(INT * 0.5 + WIL * 0.2) + Spell Power
  if (card.magicDamage && card.magicDamage > 0) {
    const statBonus = Math.floor(int * 0.5 + wil * 0.2);
    const bonus = statBonus + magAtkBonus;
    const total = card.magicDamage + bonus;
    const formulaExtra = magAtkBonus > 0 ? ` + ${magAtkBonus} Spell Power` : '';
    result.magicDamage = {
      base: card.magicDamage,
      bonus,
      total,
      statFormula: `Base ${card.magicDamage} + ${statBonus} Spell Scaling (${int} INT, ${wil} WIL)${formulaExtra}`,
    };
  }

  // 3. Block / Defense Scaling: Base + Math.floor(VIT * 0.4 + STR * 0.1) + Armor Power
  if (card.block && card.block > 0) {
    const statBonus = Math.floor(vit * 0.4 + str * 0.1);
    const bonus = statBonus + defBonus;
    const total = card.block + bonus;
    const formulaExtra = defBonus > 0 ? ` + ${defBonus} Guard Power` : '';
    result.block = {
      base: card.block,
      bonus,
      total,
      statFormula: `Base ${card.block} + ${statBonus} Armor Scaling (${vit} VIT, ${str} STR)${formulaExtra}`,
    };
  }

  // 4. Heal Scaling: Base + Math.floor(WIL * 0.4 + INT * 0.2)
  if (card.heal && card.heal > 0) {
    const bonus = Math.floor(wil * 0.4 + int * 0.2);
    const total = card.heal + bonus;
    result.heal = {
      base: card.heal,
      bonus,
      total,
      statFormula: `Base ${card.heal} + ${bonus} Holy Scaling (${wil} WIL, ${int} INT)`,
    };
  }

  return result;
}
