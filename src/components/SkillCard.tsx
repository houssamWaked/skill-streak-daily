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
      'bg-gradient-card shadow-card border-0 hover:shadow-lg transition-all duration-300',
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-xl text-foreground leading-tight">
            {skill.title}
          </CardTitle>
          {showCategory && (
            <Badge variant="secondary" className="text-xs font-medium">
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