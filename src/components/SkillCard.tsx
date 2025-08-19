import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skill } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface SkillCardProps {
  skill: Skill;
  className?: string;
  showCategory?: boolean;
}

export const SkillCard = ({ skill, className, showCategory = true }: SkillCardProps) => {
  return (
    <Card className={cn(
      'bg-gradient-glass backdrop-blur-md shadow-glow border-border/20 hover:shadow-streak transition-spring hover:scale-[1.02]',
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-xl text-foreground leading-tight font-semibold">
            {skill.title}
          </CardTitle>
          {showCategory && (
            <Badge variant="secondary" className="text-xs font-medium bg-primary/10 text-primary border-primary/20">
              {skill.category}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground leading-relaxed">
          {skill.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};